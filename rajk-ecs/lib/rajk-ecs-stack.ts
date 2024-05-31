import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2'
import * as ecs from  'aws-cdk-lib/aws-ecs'
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class RajkEcsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

      // refering to existing vpc 
      const vpc = ec2.Vpc.fromLookup(this,'ashuExistingVpc', {
        vpcId: 'vpc-063afa0c24ec80cb8'
      });
      // defining ECS cluster info 
      const cluster = new ecs.Cluster(this,'ashu-ecs-cluster',{
        clusterName: 'rajk-ecs-bycdk',
        vpc: vpc,
        enableFargateCapacityProviders: true ,
        containerInsights: true // enable cloudwatch monitoring 
      });

  
      // task Definition of farget launch type 
      const rajkTaskDef = new ecs.FargateTaskDefinition(this,'rajk-frg-task1',{
        cpu:  256,
        memoryLimitMiB: 512
         
      });
      // adding container info 
      const container = rajkTaskDef.addContainer('rajkcdkc1',{
        image: ecs.ContainerImage.fromRegistry('rajkumarp85/rajkpython:v1a75a2c3a6177b54cc9831308aa9fed55086cddee'),
        memoryLimitMiB: 256,
        portMappings: [{ containerPort: 80 }]
      });

  // creating security group 
      const ashusecgroup = new ec2.SecurityGroup(this,'ashufirewallgrp',{
        vpc: vpc,
        description: 'allow ingress rules for 80 port'
      });
      ashusecgroup.addIngressRule(ec2.Peer.anyIpv4(),ec2.Port.tcp(80),'allow http traffic');

      const service = new ecs.FargateService(this,'rajkECSserviceCDK',{
        cluster,
        taskDefinition: rajkTaskDef,
        serviceName: 'rajk-svc-bycdk',
        desiredCount: 2,
        assignPublicIp: true,
        securityGroups: [ashusecgroup]   // attaching security group 
      });


  }
}
