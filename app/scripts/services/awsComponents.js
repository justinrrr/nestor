/**
 *
 * Created by Fathalian on 10/29/14.
 */

'use strict';

var app = angular.module('nestorApp.services');
app.service('AWSComponents', function () {

  this.components = [
    {
      name: 'Autoscaling Group',
      image: 'images/aws/autoscaling.png',
      description: 'Scale your EC2 capacity up or down automatically according to conditions you define'
    },
    {
      name: 'Cloud Formation',
      image: 'images/aws/cloudformation.png',
      description: 'Import existing infrastructure templates'
    },
    {
      name: 'Cloud Front',
      image: 'images/aws/cloudfront.png',
      description: 'Content Delivery Network for your AWS resources'
    },
    {
      name: 'Cloud Search',
      image: 'images/aws/cloudsearch.png',
      description: 'Service to set up, manage, and scale a custom search solution'
    },
    {
      name: 'DynamoDb',
      image: 'images/aws/dynamo.png',
      description: 'NoSQL database service'
    },
    {
      name: 'EBS',
      image: 'images/aws/ebs.png',
      description: 'Persistent block level storage volumes for EC2 instances'

    },
    {
      name: 'EC2',
      image: 'images/aws/ec2.png',
      description: 'Resizable compute machines'
    },
    {
      name: 'Elastic IP',
      image: 'images/aws/eip.png',
      description: 'Static IP address that are dynamically allocated'
    },
    {
      name: 'Elasticache',
      image: 'images/aws/elasticache.png',
      description: 'Deploy, operate, and scale an in-memory cache'
    },
    {
      name: 'ELB',
      image: 'images/aws/elb.png',
      description: 'Automatically distributes incoming application traffic across multiple EC2 instances'
    },
    {
      name: 'rds',
      image: 'images/aws/rds.png',
      description: 'Set up, operate, and scale a relational database'
    },
    {
      name: 'redshift',
      image: 'images/aws/redshift.png',
      description: 'fully managed, petabyte-scale data warehouse solution'
    },
    {
      name: 'route53',
      image: 'images/aws/route53.png',
      description: 'highly available and scalable Domain Name System (DNS)'
    },
    {
      name: 'S3',
      image: 'images/aws/s3.png',
      description: 'Secure, durable, highly-scalable object storage'
    },
    {
      name: 'SES',
      image: 'images/aws/ses.png',
      description: 'Outbound-only email-sending service'
    },
    {
      name: 'SNS',
      image: 'images/aws/sns.png',
      description: 'Fully managed push messaging service'
    },
    {
      name: 'SQS',
      image: 'images/aws/sqs.png',
      description: 'Fast, reliable, scalable, fully managed message queuing service'
    },
    {
      name: 'VPC',
      image: 'images/aws/vpc.png',
      description: 'Logically isolated section of the Cloud to launch resources in a virtual network that you define'
    },
  ];

});
