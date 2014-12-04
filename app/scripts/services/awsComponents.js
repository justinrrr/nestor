/**
 *
 * Created by Fathalian on 10/29/14.
 */

'use strict';

var app = angular.module('nestorApp.services');
app.service('AWSComponents', function () {

    /* jshint ignore:start */
    this.tasks = [
      {
        name: 'Simple static website',
        image: 'images/aws/customtask.jpg',
        type: 'task'
      },
      {
        name: 'A group of servers that scale automatically',
        image: 'images/aws/customtask.jpg',
        type: 'task'
      },
      {
        name: 'Simple web server with database access',
        image: 'images/aws/customtask.jpg',
        template: {"AWSTemplateFormatVersion": "2010-09-09", "Description": "Created By Nestor", "Parameters": {}, "Mappings": {}, "Conditions": {}, "Resources": {"DynamoDb-1": {"Type": "AWS::DynamoDB::Table", "Properties": {}}, "EC2-2": {"Type": "AWS::EC2::Instance", "Properties": {"BlockDeviceMappings": [
          {}
        ], "SecurityGroups": [
          {"Ref": "SecurityGroup-3"}
        ]}}, "SecurityGroup-3": {"Type": "AWS::EC2::SecurityGroup", "Properties": {}}, "EIP-5": {"Type": "AWS::EC2::EIP", "Properties": {"InstanceId": {"Ref": "EC2-2"}}}, "Route53-6": {"Type": "AWS::Route53::RecordSet", "Properties": {}}}, "Outputs": {"DynamoDb-1-TableName": {"Description": "Name of the created DynamoDb Table", "Value": {"Ref": "DynamoDb-1"}}, "EC2-2-ImageId": {"Description": "Name of the EC2 instance", "Value": {"Ref": "EC2-2"}}, "SecurityGroup-3-security group identifier": {"Description": "the security group name (for EC2-classic) or the security group ID (for EC2-VPC)", "Value": {"Ref": "SecurityGroup-3"}}, "EIP-5-Public IP": {"Description": "returns the value of the PublicIp for the EC2 instance", "Value": {"Ref": "EIP-5"}}}},
        components: {"DynamoDb-1": {"id": "DynamoDb-1", "type": "DynamoDb", "name": "DynamoDb-1", "description": "NoSQL database service", "image": "images/aws/dynamo.png", "x": 581, "y": 523, "required": [
          {"name": "TableName", "description": "name of the table", "type": "String"},
          {"name": "AttributeDefinitions", "type": "AttributeDefinitions"},
          {"name": "KeySchema", "type": "KeySchema"},
          {"name": "ProvisionedThroughput", "type": "ProvisionedThroughput"}
        ], "optional": [
          {"name": "GlobalSecondaryIndexes", "type": "GlobalSecondaryIndexes"},
          {"name": "LocalSecondaryIndexes", "type": "LocalSecondaryIndexes"}
        ], "parent": ""}, "EC2-2": {"id": "EC2-2", "type": "EC2", "name": "EC2-2", "description": "Resizable compute machines", "image": "images/aws/ec2.png", "x": 592, "y": 282, "required": [
          {"name": "ImageId", "type": "String", "description": "Name of the EC2 instance", "allowableValues": [
            {"ami-77581047": "Stewie"},
            {"ami-67334857": "Jenkins"},
            {"ami-67334857": "MyCustomAmi"},
            {"dummy": "---Standard AMIs---"},
            {"ami-b5a7ea85": "Amazon Linux AMI 2014.09.1 (HVM)"},
            {"ami-99bef1a9": "Red Hat Enterprise Linux 7.0 (HVM)"},
            {"ami-d7450be7": "SuSE Linux Enterprise Server 12 (HVM)"},
            {"ami-3d50120d": "Ubuntu Server 14.04 LTS (HVM)"},
            {"ami-21f0bc11": "Microsoft Windows Server 2012 R2 Base"}
          ]}
        ], "optional": [
          {"name": "BlockDeviceMappings", "type": "BlockDeviceMappings", "description": "tooltip??"},
          {"name": "NetworkInterfaces", "type": "NetworkInterfaces", "description": "A list of NetworkInterface embedded objects that describe the network interfaces to associate with this instance"},
          {"name": "SecurityGroupIds", "type": "StringList", "description": "A list that contains the security group IDs for VPC security groups to assign to the Amazon EC2 instance. If you specified the NetworkInterfaces property, do not specify this property"},
          {"name": "SecurityGroups", "type": "StringList", "description": "Valid only for Amazon EC2 security groups. A list that contains the Amazon EC2 security groups to assign to the Amazon EC2 instance. The list can contain both the name of existing Amazon EC2 security groups or references to AWS::EC2::SecurityGroup resources created in the template"},
          {"name": "Tags", "type": "Tags", "description": "tooltip??"},
          {"name": "Volumes", "type": "Volumes", "description": "tooltip??"},
          {"name": "AvailabilityZone", "type": "String", "description": "Specifies the name of the Availability Zone in which the instance is located", "allowableValues": [
            {"ap-northeast-1": "Asia Pacific (Tokyo)"},
            {"ap-southeast-1": "Asia Pacific (Singapore)"},
            {"ap-southeast-2": "Asia Pacific (Sydney)"},
            {"eu-central-1": "EU (Frankfurt)"},
            {"eu-west-1": "EU (Ireland)"},
            {"sa-east-1": "South America (Sao Paulo)"},
            {"us-east-1": "US East (N. Virginia)"},
            {"us-west-1": "US West (N. California)"},
            {"us-west-2": "US West (Oregon)"}
          ]},
          {"name": "DisableApiTermination", "type": "Boolean", "description": "Description for tooltip"},
          {"name": "EbsOptimized", "type": "Boolean", "description": "Description for tooltip"},
          {"name": "IamInstanceProfile", "type": "String", "description": "Description for tooltip"},
          {"name": "InstanceInitiatedShutdownBehavior", "type": "String", "description": "Description for tooltip"},
          {"name": "InstanceType", "type": "String", "description": "Description for tooltip", "allowableValues": [
            {"t2.micro": "t2.micro"},
            {"t2.small": "t2.small"},
            {"t2.medium": "t2.medium"},
            {"m3.medium": "m3.medium"},
            {"m3.large": "m3.large"},
            {"m3.xlarge": "m3.xlarge"},
            {"m3.2xlarge": "m3.2xlarge"},
            {"c3.large": "c3.large"},
            {"c3.xlarge": "c3.xlarge"},
            {"c3.2xlarge": "c3.2xlarge"},
            {"c3.4xlarge": "c3.4xlarge"},
            {"c3.8xlarge": " c3.8xlarge"},
            {"r3.large": "r3.large"},
            {"r3.xlarge": "r3.xlarge"},
            {"r3.2xlarge": "r3.2xlarge"},
            {"r3.4xlarge": "r3.4xlarge"},
            {"r3.8xlarge": "r3.8xlarge"},
            {"i2.xlarge": "i2.xlarge"},
            {"i2.2xlarge": "i2.2xlarge"},
            {"i2.4xlarge": "i2.4xlarge"},
            {"i2.8xlarge": "i2.8xlarge"},
            {"hs1.8xlarge": "hs1.8xlarge"},
            {"g2.2xlarge": "g2.2xlarge"}
          ]},
          {"name": "KernelId", "type": "String", "description": "Description for tooltip"},
          {"name": "KeyName", "type": "String", "description": "Description for tooltip"},
          {"name": "Monitoring", "type": "Boolean", "description": "Description for tooltip"},
          {"name": "PlacementGroupName", "type": "String", "description": "Description for tooltip"},
          {"name": "PrivateIpAddress", "type": "String", "description": "Description for tooltip"},
          {"name": "RamdiskId", "type": "String", "description": "Description for tooltip"},
          {"name": "SourceDestCheck", "type": "Boolean", "description": "Description for tooltip"},
          {"name": "SubnetId", "type": "String", "description": "Description for tooltip"},
          {"name": "Tenancy", "type": "String", "description": "Description for tooltip", "allowableValues": [
            {"default": "default"},
            {"dedicated": "dedicated"}
          ]},
          {"name": "UserData", "type": "String", "description": "Description for tooltip"}
        ], "parent": ""}, "SecurityGroup-3": {"id": "SecurityGroup-3", "type": "SecurityGroup", "name": "SecurityGroup-3", "description": "Creates an Amazon EC2 security group", "image": "images/aws/securityGroup.png", "x": 475, "y": 82, "required": [
          {"name": "GroupDescription", "type": "String", "description": "Description of the security group"}
        ], "optional": [
          {"name": "SecurityGroupEgress", "type": "SecurityGroupEgress", "description": "A list of Amazon EC2 security group outgoing connection rules"},
          {"name": "SecurityGroupIngress", "type": "SecurityGroupIngress", "description": "A list of Amazon EC2 security group incoming connection rules"},
          {"name": "Tags", "type": "Tags", "description": "The tags that you want to attach to the resource"}
        ], "parent": ""}, "BlockDeviceMappings-4": {"id": "BlockDeviceMappings-4", "type": "BlockDeviceMappings", "name": "BlockDeviceMappings-4", "image": "images/aws/blockDeviceMapping.png", "x": 737, "y": 129, "required": [
          {"name": "AvailabilityZone", "type": "String", "description": ""}
        ], "optional": [
          {"name": "Encrypted", "type": "Boolean", "description": ""},
          {"name": "Iops", "type": "Number", "description": ""},
          {"name": "Size", "type": "String", "description": ""},
          {"name": "SnapshotId", "type": "String", "description": ""},
          {"name": "Tags", "type": "Tags", "description": "An arbitrary set of tags (key–value pairs) for this volume."},
          {"name": "VolumeType", "type": "String", "description": ""}
        ], "parent": "EC2-2", "isDerived": true}, "EIP-5": {"id": "EIP-5", "type": "EIP", "name": "EIP-5", "description": "Elastic(Static) IP address that are dynamically allocated", "image": "images/aws/eip.png", "x": 288, "y": 288, "required": [
          {"name": "InstanceId", "type": "String", "description": "The Instance ID of the Amazon EC2 instance that you want to associate with this Elastic IP address"}
        ], "optional": [
          {"name": "Domain", "type": "String", "description": "Set to vpc to allocate the address to your Virtual Private Cloud (VPC). No other values are supported"}
        ], "parent": ""}, "Route53-6": {"id": "Route53-6", "type": "Route53", "name": "Route53-6", "description": "highly available and scalable Domain Name System (DNS)", "image": "images/aws/route53.png", "x": 49, "y": 238, "required": [
          {"name": "HostedZoneName", "type": "String", "description": "The name of the domain for the hosted zone where you want to add the record set"},
          {"name": "Type", "type": "String", "description": "The type of records to add"},
          {"name": "Name", "type": "String", "description": "The name of the domain. This must be a fully specified domain, ending with a period as the last label indication. If you omit the final period, Amazon Route 53 assumes the domain is relative to the root"}
        ], "optional": [
          {"name": "TTL", "type": "String", "description": "The resource record cache time to live (TTL), in seconds"},
          {"name": "ResourceRecords", "type": "StringList", "description": "List of resource records to add. Each record should be in the format appropriate for the record type specified by the Type property"},
          {"name": "Comment", "type": "String", "description": "Any comments you want to include about the hosted zone"}
        ], "parent": ""}},
        connections: [
          {"source": "DynamoDb-1", "target": "EC2-2"},
          {"source": "EC2-2", "target": "BlockDeviceMappings-4"},
          {"source": "EC2-2", "target": "SecurityGroup-3"},
          {"source": "Route53-6", "target": "EIP-5"},
          {"source": "EIP-5", "target": "EC2-2"}
        ],
        type: 'task'
      },
      {
        name: 'Group of servers with a single load balancer',
        image: 'images/aws/customtask.jpg',
        type: 'task'
      },
      {
        name: 'Publisher/Subscriber group of workers',
        image: 'images/aws/customtask.jpg',
        type: 'task'
      },
      {
        name: 'Group of workers reading off of queues',
        image: 'images/aws/customtask.jpg',
        type: 'task'
      },
      {
        name: 'Webserver with Distributed cache and database',
        image: 'images/aws/customtask.jpg',
        type: 'task'
      },
      {
        name: 'Search infrastructure',
        image: 'images/aws/customtask.jpg',
        type: 'task'
      },
      {
        name: 'Continous Deployment Pipleline',
        image: 'images/aws/customtask.jpg',
        type: 'task'
      },
      {
        name: 'A simple MapReduce system',
        image: 'images/aws/customtask.jpg',
        type: 'task'
      },
      {
        name: 'A pipeline for processing streams of big data',
        image: 'images/aws/customtask.jpg',
        type: 'task'
      },
      {
        name: 'Big calculating machines for big boys',
        image: 'images/aws/customtask.jpg',
        type: 'task'
      }

    ];
    /* jshint ignore:end */
    this.components = [
      {
        name: 'Autoscaling Group',
        image: 'images/aws/autoscaling.png',
        description: 'Scale your EC2 capacity up or down automatically according to conditions you define',
        type: 'resource'
      },
      {
        name: 'DynamoDb',
        image: 'images/aws/dynamo.png',
        description: 'NoSQL database service',
        type: 'AWS::DynamoDB::Table',
        blockType: 'box'
      },
      {
        name: 'EIP',
        image: 'images/aws/eip.png',
        description: 'Elastic(Static) IP address that are dynamically allocated',
        type: 'AWS::EC2::EIP',
        blockType: 'box'
      },
      {
        name: 'EC2',
        image: 'images/aws/ec2.png',
        description: 'Resizable compute machines',
        type: 'AWS::EC2::Instance',
        blockType: 'box'
      },
      {
        name: 'ELB',
        image: 'images/aws/elb.png',
        description: 'Automatically distributes incoming application traffic across multiple EC2 instances',
        type: 'AWS::ElasticLoadBalancing::LoadBalancer',
        blockType: 'box'
      },
      {
        name: 'Route53',
        image: 'images/aws/route53.png',
        description: 'highly available and scalable Domain Name System (DNS)',
        type: 'AWS::Route53::RecordSet',
        blockType: 'box'
      },
      {
        name: 'SecurityGroup',
        image: 'images/aws/securygroup.png',
        description: 'Creates an Amazon EC2 security group',
        type: 'AWS::EC2::SecurityGroup',
        blockType: 'box'
      },
      {
        name: 'VPC',
        image: 'images/aws/vpc.png',
        description: 'Logically isolated section of the Cloud to launch resources in a virtual network that you define',
        type: 'AWS::EC2::VPC',
        blockType: 'container'
      },
      {
        name: 'Subnet',
        image: 'images/aws/subnet.png',
        description: 'subnet in an existing VPC.',
        type: 'AWS::EC2::Subnet',
        blockType: 'container'
      }
      //{
      //  name: 'Cloud Formation',
      //  image: 'images/aws/cloudformation.png',
      //  description: 'Import existing infrastructure templates'
      //},
      //{
      //  name: 'Cloud Front',
      //  image: 'images/aws/cloudfront.png',
      //  description: 'Content Delivery Network for your AWS resources'
      //},
      //{
      //  name: 'Cloud Search',
      //  image: 'images/aws/cloudsearch.png',
      //  description: 'Service to set up, manage, and scale a custom search solution'
      //},
      //{
      //  name: 'EBS',
      //  image: 'images/aws/ebs.png',
      //  description: 'Persistent block level storage volumes for EC2 instances'
      //
      //},
      //{
      //  name: 'Elasticache',
      //  image: 'images/aws/elasticache.png',
      //  description: 'Deploy, operate, and scale an in-memory cache'
      //},
      //{
      //  name: 'rds',
      //  image: 'images/aws/rds.png',
      //  description: 'Set up, operate, and scale a relational database'
      //},
      //{
      //  name: 'redshift',
      //  image: 'images/aws/redshift.png',
      //  description: 'fully managed, petabyte-scale data warehouse solution'
      //},
      //{
      //  name: 'S3',
      //  image: 'images/aws/s3.png',
      //  description: 'Secure, durable, highly-scalable object storage'
      //},
      //{
      //  name: 'SES',
      //  image: 'images/aws/ses.png',
      //  description: 'Outbound-only email-sending service'
      //},
      //{
      //  name: 'SNS',
      //  image: 'images/aws/sns.png',
      //  description: 'Fully managed push messaging service'
      //},
      //{
      //  name: 'SQS',
      //  image: 'images/aws/sqs.png',
      //  description: 'Fast, reliable, scalable, fully managed message queuing service'
      //},
    ];

    //add component specific metadat here
    this.componentMetadata = {

      'NameOfTheComponent': {
        type: 'AWS::Component::Table',
        // When the user drags a link from another object (Source) to connect it to this component (Target) use the following rules
        IncomingConnection: {

          'SourceComponentName': {    // e.g. EC2, DynamoDB
            overlays: [
              ['PlainArrow', {direction: -1, location: 0, width: 10, length: 10}],
              ['Label', {label: 'Depends On'}]
            ],

            //you can mention one or more of all targetProperties or sourceProperties


            //the name of the property on Target to be modified
            targetPropName: 'optional, do not set if it does not apply',

            //name of the property on Source which its value needs to be assigned to targetPropName
            //if the value is 'name' it will set it to the whole object
            targetPropValue: 'optional, do not set if it does not apply',

            //how to interpret targetPropValue:  pure/ref/attribute
            targetPropValueMethod: 'optional, do not set if it does not apply',

            // how to update targetPropName with targetPropValue
            targetPolicy: 'assign/append',

            //optional, don't set if it doesn't apply
            sourcePropName: 'the name of the property on Source to be modified',

            //optional, don't set if it doesn't apply
            //if the value is 'name' it will set it to the whole object
            sourcePropValue: 'name of the property on Target which its value needs to be assigned to sourcePropName',

            //optional, defaults to "pure"
            sourcePropValueMethod: 'how to interpret sourcePropValue:  pure/ref/attribute',

            // how to update sourcePropName with sourcePropValue
            sourcePolicy: 'assign/append',

            // should the new value be added under "Properties" or be a new field on the affected object
            isProperty: 'true/false'
          }
        },
        properties: {
          required: [
            {
              name: 'nameOfProperty',
              type: 'type of the property, if it is complex you should add it to the typedefs',
              description: 'tooltop description if property is primitive'
            },
            {name: 'nameOfProperty', type: 'typeOfTheProperty', description: 'Description for tooltip'}
          ],
          optional: [
            {
              name: 'nameOfProperty',
              type: 'type of the property, if it is complex you should add it to the typedefs',
              description: 'tooltop description if property is primitive'
            },
            {name: 'nameOfProperty', type: 'typeOfTheProperty', description: 'Description for tooltip'}
          ]
        },
        outputs: [
          {
            type: 'acceptable values are Ref and GetAtt',
            name: 'userFriendlyNameOfOutput',
            description: 'userFriendlyDescriptionOfOutput'
          }
        ]
      },
      'AWS::EC2::VPC': {
        type: 'AWS::EC2::VPC',
        IncomingConnection: {
          'AWS::EC2::Subnet': {
            sourcePropName: 'VpcId',
            sourcePropValue: 'name',
            sourcePropValueMethod: 'ref',
            sourcePolicy: 'assign',
            isProperty: 'true'
          }

        },
        properties: {
          required: [
            {
              name: 'CidrBlock',
              type: 'String',
              description: 'The CIDR block you want the VPC to cover. For example: 10.0.0.0/16'
            }

          ],
          optional: [
            {
              name: 'EnableDnsSupport',
              type: 'Boolean',
              description: 'Specifies whether DNS resolution is supported for the VPC. If this attribute is true, the Amazon DNS server resolves DNS hostnames for your instances to their corresponding IP addresses; otherwise, it does not. By default the value is set to true'
            },
            {
              name: 'EnableDnsHostnames',
              type: 'Boolean',
              description: 'Specifies whether the instances launched in the VPC get DNS hostnames. If this attribute is true, instances in the VPC get DNS hostnames; otherwise, they do not. You can only set EnableDnsHostnames to true if you also set the EnableDnsSupport attribute to true. By default, the value is set to false.'
            },
            {
              name: 'InstanceTenancy',
              type: 'String',
              description: 'The allowed tenancy of instances launched into the VPC',
              allowableValues: [
                {
                  'default': 'default'
                },
                {
                  'dedicated': 'dedicated'
                }
              ]
            },
            {name: 'Tags', type: 'Tags', description: 'The tags that you want to attach to the resource'}
          ]
        }
      },
      'AWS::EC2::Subnet': {
        type: 'AWS::EC2::Subnet',
        IncomingConnection: {
        },
        properties: {
          required: [
            {
              name: 'VpcId',
              type: 'String',
              description: 'Id of the VPC to which this subnet belongs'
            },
            {
              name: 'CidrBlock',
              type: 'String',
              description: 'The CIDR block you want the subnet to cover. For example: 10.0.0.0/16'
            }
          ],
          optional: [
            {
              name: 'AvailabilityZone',
              type: 'String',
              description: 'Specifies the name of the Availability Zone in which the subnet is located',
              // a list of allowable values
              allowableValues: [
                {
                  'ap-northeast-1b': 'Asia Pacific (Tokyo)'
                },
                {
                  'ap-southeast-1b': 'Asia Pacific (Singapore)'
                },
                {
                  'ap-southeast-2b': 'Asia Pacific (Sydney)'
                },
                {
                  'eu-central-1b': 'EU (Frankfurt)'
                },
                {
                  'eu-west-1b': 'EU (Ireland)'
                },
                {
                  'sa-east-1b': 'South America (Sao Paulo)'
                },
                {
                  'us-east-1b': 'US East (N. Virginia)'
                },
                {
                  'us-west-1b': 'US West (N. California)'
                },
                {
                  'us-west-2b': 'US West (Oregon)'
                }
              ]
            },
            {name: 'Tags', type: 'Tags', description: 'tooltip??'}
          ]
        },
        outputs: [
          {
            type: 'Ref',
            name: 'subnetId',
            description: 'Logical Id of the subnet'
          }
        ]
      },
      'AWS::Route53::RecordSet': {
        type: 'AWS::Route53::RecordSet',
        // When the user drags a link from another object (Source) to connect it to this component (Target) use the following rules
        IncomingConnection: {

          'AWS::EC2::EIP': {    // e.g. EC2, DynamoDB

            //the name of the property on Target to be modified
            targetPropName: 'ResourceRecords',

            //name of the property on Source which its value needs to be assigned to targetPropName
            targetPropValue: 'PublicIp',

            //how to interpret targetPropValue:  pure/ref/attribute
            targetPropValueMethod: 'ref',

            // how to update targetPropName with targetPropValue
            targetPolicy: 'append',

            // should the new value be added under "Properties" or be a new field on the affected object
            isProperty: 'true'
          },

          'AWS::EC2::Instance': {

            //the name of the property on Target to be modified
            targetPropName: 'ResourceRecords',

            //name of the property on Source which its value needs to be assigned to targetPropName
            targetPropValue: 'PublicIp',

            //how to interpret targetPropValue:  pure/ref/attribute
            targetPropValueMethod: 'attribute',

            // how to update targetPropName with targetPropValue
            targetPolicy: 'append',

            // should the new value be added under "Properties" or be a new field on the affected object
            isProperty: 'true'
          }

        },
        properties: {
          required: [
            {
              name: 'HostedZoneName',
              type: 'String',
              description: 'The name of the domain for the hosted zone where you want to add the record set',
              allowableValues: [
                {'pdestal.com.': 'pdestal.com'}
              ]


            },
            {
              name: 'Type',
              type: 'String',
              description: 'The type of records to add',
              allowableValues: [
                {'A': 'A'},
                {'AAAA': 'AAAA'},
                {'CNAME': 'CNAME'},
                {'MX': 'MX'},
                {'NS': 'NS'},
                {'PTR': 'PTR'},
                {'SOA': 'SOA'},
                {'SPF': 'SPF'},
                {'SRC': 'SRV'},
                {'TXT': 'TXT'}
              ]
            },
            {
              name: 'Name',
              type: 'String',
              description: 'The name of the domain. This must be a fully specified domain, ending with a period as the last label indication. If you omit the final period, Amazon Route 53 assumes the domain is relative to the root'
            }
          ],
          optional: [
            {
              name: 'TTL',
              type: 'Integer',
              description: 'The resource record cache time to live (TTL), in seconds',
              default: ['300']
            },
            {
              name: 'ResourceRecords',
              type: 'StringList',
              description: 'List of resource records to add. Each record should be in the format appropriate for the record type specified by the Type property'
            },
            {
              name: 'Comment',
              type: 'String',
              description: 'Any comments you want to include about the hosted zone'
            }
          ]
        },
        outputs: [
          {
            type: 'acceptable values are Ref and GetAtt',
            name: 'userFriendlyNameOfOutput',
            description: 'userFriendlyDescriptionOfOutput'
          }
        ]
      },

      'AWS::EC2::SecurityGroup': {
        type: 'AWS::EC2::SecurityGroup',

        // When the user drags a link from another object (source) to connect it to this component (target) use the following rules
        IncomingConnection: {

          'AWS::EC2::Instance': {

            //the name of the property on Source to be modified
            sourcePropName: 'SecurityGroups',

            //name of the property on Target which its value needs to be assigned to sourcePropName
            sourcePropValue: 'name',

            //how to interpret sourcePropValue:  pure/ref/attribute
            sourcePropValueMethod: 'ref',

            // how to update sourcePropName with sourcePropValue
            sourcePolicy: 'append',

            // should the new value be added under "Properties" or be a new field on the affected object
            isProperty: 'true'
          }
        },

        properties: {
          required: [
            {name: 'GroupDescription', type: 'String', description: 'Description of the security group'}
          ],
          optional: [
            {
              name: 'SecurityGroupEgress',
              type: 'SecurityGroupEgress',
              description: 'A list of Amazon EC2 security group outgoing connection rules'
            },
            {
              name: 'SecurityGroupIngress',
              type: 'SecurityGroupIngress',
              description: 'A list of Amazon EC2 security group incoming connection rules'
            },
            {name: 'Tags', type: 'Tags', description: 'The tags that you want to attach to the resource'}
            //TODO: take this item back when we add support for VPC
//          {name: 'VcpId', type: 'String', description: 'The physical ID of the VPC. Can be obtained by using a reference to an AWS::EC2::VPC, such as: { "Ref" : "myVPC" }'}
          ]
        },
        outputs: [
          {
            type: 'Ref',
            name: 'securityGroupIdentifier',
            description: 'the security group name (for EC2-classic) or the security group ID (for EC2-VPC)'
          }
        ]
      },

      'AWS::DynamoDB::Table': {
        type: 'AWS::DynamoDB::Table',
        IncomingConnection: {
          //if dynamoDB got connected
          'AWS::DynamoDB::Table': {
            overlays: [
              ['PlainArrow', {direction: -1, location: 0, width: 10, length: 10}],
              ['Label', {label: 'Depends On'}]
            ],
            // if this connection is a one-way connection or bi-directional
            type: 'oneWay',

            //the name of the property on Target to be modified
            targetPropName: 'DependsOn',

            //name of the property on Source which its value needs to be assigned to targetPropName
            targetPropValue: 'Name',

            //how to interpret targetPropValue
            targetPropValueMethod: 'pure',

            // how to update targetPropName with targetPropValue
            targetPolicy: 'assign',

            // should the new value be added under "Properties" or be a new field on the affected object
            isProperty: 'false'
          }
        },
        properties: {
          required: [
            {name: 'TableName', description: 'name of the table', type: 'String'},
            {name: 'AttributeDefinitions', type: 'AttributeDefinitions'},
            {name: 'KeySchema', type: 'KeySchema'},
            {name: 'ProvisionedThroughput', type: 'ProvisionedThroughput'}
          ],
          optional: [
            {name: 'GlobalSecondaryIndexes', type: 'GlobalSecondaryIndexes'},
            {name: 'LocalSecondaryIndexes', type: 'LocalSecondaryIndexes'}
          ]
        },
        outputs: [
          {
            type: 'Ref',
            name: 'TableName',
            description: 'Name of the created DynamoDb Table'
          }
        ]
      },

      'AWS::EC2::Instance': {
        type: 'AWS::EC2::Instance',

        IncomingConnection: {

          'AWS::EC2::SecurityGroup': {
            //the name of the property on Target to be modified
            targetPropName: 'SecurityGroups',

            //name of the property on Source which its value needs to be assigned to targetPropName
            targetPropValue: 'name',

            //how to interpret targetPropValue
            targetPropValueMethod: 'ref',

            // how to update targetPropName with targetPropValue
            targetPolicy: 'append',

            // should the new value be added under "Properties" or be a new field on the affected object
            isProperty: 'true'
          },

          'AWS::EC2::EIP': {    // e.g. EC2, DynamoDB

            //the name of the property on Source to be modified
            sourcePropName: 'InstanceId',

            //name of the property on Target which its value needs to be assigned to sourcePropName
            sourcePropValue: 'Name',

            //how to interpret sourcePropValue:  pure/ref/attribute
            sourcePropValueMethod: 'ref',

            // how to update sourcePropName with sourcePropValue
            sourcePolicy: 'assign',

            // should the new value be added under "Properties" or be a new field on the affected object
            isProperty: 'true'
          },

          'AWS::Route53::RecordSet': {
            //the name of the property on Source to be modified
            sourcePropName: 'ResourceRecords',

            //name of the property on Target which its value needs to be assigned to sourcePropName
            sourcePropValue: 'PublicIp',

            //how to interpret sourcePropValue:  pure/ref/attribute
            sourcePropValueMethod: 'attribute',

            // how to update sourcePropName with sourcePropValue
            sourcePolicy: 'append',

            // should the new value be added under "Properties" or be a new field on the affected object
            isProperty: 'true'
          }


        },

        properties: {
          required: [
            {
              name: 'ImageId',
              type: 'String',
              description: 'Name of the EC2 instance',
              allowableValues: [
                {'ami-77581047': 'Stewie'},
                {'ami-67334857': 'Jenkins'},
                {'ami-67334857': 'MyCustomAmi'},
                {'dummy': '---Standard AMIs---'},
                {'ami-b5a7ea85': 'Amazon Linux AMI 2014.09.1 (HVM)'},
                {'ami-99bef1a9': 'Red Hat Enterprise Linux 7.0 (HVM)'},
                {'ami-d7450be7': 'SuSE Linux Enterprise Server 12 (HVM)'},
                {'ami-3d50120d': 'Ubuntu Server 14.04 LTS (HVM)'},
                {'ami-21f0bc11': 'Microsoft Windows Server 2012 R2 Base'}
              ]
            }
          ],
          optional: [

            {name: 'BlockDeviceMappings', type: 'BlockDeviceMappings', description: 'tooltip??'},
            {
              name: 'NetworkInterfaces',
              type: 'NetworkInterfaces',
              description: 'A list of NetworkInterface embedded objects that describe the network interfaces to associate with this instance'
            },
            {
              name: 'SecurityGroupIds',
              type: 'StringList',
              description: 'A list that contains the security group IDs for VPC security groups to assign to the Amazon EC2 instance. If you specified the NetworkInterfaces property, do not specify this property'
            },
            {
              name: 'SecurityGroups',
              type: 'StringList',
              description: 'Valid only for Amazon EC2 security groups. A list that contains the Amazon EC2 security groups to assign to the Amazon EC2 instance. The list can contain both the name of existing Amazon EC2 security groups or references to AWS::EC2::SecurityGroup resources created in the template'
            },
            {name: 'Tags', type: 'Tags', description: 'tooltip??'},
            {name: 'Volumes', type: 'Volumes', description: 'tooltip??'},

            {
              name: 'AvailabilityZone',
              type: 'String',
              description: 'Specifies the name of the Availability Zone in which the instance is located',
              // a list of allowable values
              allowableValues: [
                {
                  'ap-northeast-1b': 'Asia Pacific (Tokyo)'
                },
                {
                  'ap-southeast-1b': 'Asia Pacific (Singapore)'
                },
                {
                  'ap-southeast-2b': 'Asia Pacific (Sydney)'
                },
                {
                  'eu-central-1b': 'EU (Frankfurt)'
                },
                {
                  'eu-west-1b': 'EU (Ireland)'
                },
                {
                  'sa-east-1b': 'South America (Sao Paulo)'
                },
                {
                  'us-east-1b': 'US East (N. Virginia)'
                },
                {
                  'us-west-1b': 'US West (N. California)'
                },
                {
                  'us-west-2b': 'US West (Oregon)'
                }
              ]

            },
            {
              name: 'InstanceType',
              type: 'String',
              description: 'Description for tooltip',
              allowableValues: [
                {
                  't2.micro': 't2.micro'
                },
                {
                  't2.small': 't2.small'
                },
                {
                  't2.medium': 't2.medium'
                },
                {
                  'm3.medium': 'm3.medium'
                },
                {
                  'm3.large': 'm3.large'
                },
                {
                  'm3.xlarge': 'm3.xlarge'
                },
                {
                  'm3.2xlarge': 'm3.2xlarge'
                },
                {
                  'c3.large': 'c3.large'
                },
                {
                  'c3.xlarge': 'c3.xlarge'
                },
                {
                  'c3.2xlarge': 'c3.2xlarge'
                },
                {
                  'c3.4xlarge': 'c3.4xlarge'
                },
                {
                  'c3.8xlarge': ' c3.8xlarge'
                },
                {
                  'r3.large': 'r3.large'
                },
                {
                  'r3.xlarge': 'r3.xlarge'
                },
                {
                  'r3.2xlarge': 'r3.2xlarge'
                },
                {
                  'r3.4xlarge': 'r3.4xlarge'
                },
                {
                  'r3.8xlarge': 'r3.8xlarge'
                },
                {
                  'i2.xlarge': 'i2.xlarge'
                },
                {
                  'i2.2xlarge': 'i2.2xlarge'
                },
                {
                  'i2.4xlarge': 'i2.4xlarge'
                },
                {
                  'i2.8xlarge': 'i2.8xlarge'
                },
                {
                  'hs1.8xlarge': 'hs1.8xlarge'
                },
                {
                  'g2.2xlarge': 'g2.2xlarge'
                }
              ]
            },
            {name: 'KeyName', type: 'String', description: 'Description for tooltip'},
            {name: 'EbsOptimized', type: 'Boolean', description: 'Description for tooltip'},
            {name: 'IamInstanceProfile', type: 'String', description: 'Description for tooltip'},
            {name: 'DisableApiTermination', type: 'Boolean', description: 'Description for tooltip'},
            {name: 'KernelId', type: 'String', description: 'Description for tooltip'},
            {name: 'Monitoring', type: 'Boolean', description: 'Description for tooltip'},
            {name: 'InstanceInitiatedShutdownBehavior', type: 'String', description: 'Description for tooltip'},
            {name: 'PlacementGroupName', type: 'String', description: 'Description for tooltip'},
            {name: 'PrivateIpAddress', type: 'String', description: 'Description for tooltip'},
            {name: 'RamdiskId', type: 'String', description: 'Description for tooltip'},
            {name: 'SourceDestCheck', type: 'Boolean', description: 'Description for tooltip'},
            {name: 'SubnetId', type: 'String', description: 'Description for tooltip'},
            {
              name: 'Tenancy',
              type: 'String',
              description: 'Description for tooltip',
              allowableValues: [
                {
                  'default': 'default'
                },
                {
                  'dedicated': 'dedicated'
                }
              ]
            },
            {name: 'UserData', type: 'String', description: 'Description for tooltip'}
          ]
        },
        outputs: [
          {
            type: 'Ref',
            name: 'ImageId',
            description: 'Name of the EC2 instance'
          }
        ]
      },

      'AWS::EC2::EIP': {
        type: 'AWS::EC2::EIP',
        // When the user drags a link from another object (Source) to connect it to this component (Target) use the following rules
        IncomingConnection: {

          'AWS::EC2::Instance': {    // e.g. EC2, DynamoDB

            //the name of the property on Target to be modified
            targetPropName: 'InstanceId',

            //name of the property on Source which its value needs to be assigned to targetPropName
            targetPropValue: 'Name',

            //how to interpret targetPropValue:  pure/ref/attribute
            targetPropValueMethod: 'ref',

            // how to update targetPropName with targetPropValue
            targetPolicy: 'assign',

            // should the new value be added under "Properties" or be a new field on the affected object
            isProperty: 'true'
          }
        },
        properties: {
          required: [
            {
              name: 'InstanceId',
              type: 'String',
              description: 'The Instance ID of the Amazon EC2 instance that you want to associate with this Elastic IP address'
            }
          ],
          optional: [
            {
              name: 'Domain',
              type: 'String',
              description: 'Set to vpc to allocate the address to your Virtual Private Cloud (VPC). No other values are supported'
            }
          ]
        },
        outputs: [
          {
            type: 'Ref',
            name: 'PublicIP',
            description: 'returns the value of the PublicIp for the EC2 instance'
          }
        ]
      },

      'AWS::ElasticLoadBalancing::LoadBalancer': {
        type: 'AWS::ElasticLoadBalancing::LoadBalancer',
        // When the user drags a link from another object (Source) to connect it to this component (Target) use the following rules
        IncomingConnection: {

          'SourceComponentName': {    // e.g. EC2, DynamoDB
            overlays: [
              ['PlainArrow', {direction: -1, location: 0, width: 10, length: 10}],
              ['Label', {label: 'Depends On'}]
            ],

            //the name of the property on Target to be modified
            targetPropName: 'optional, do not set if it does not apply',

            //name of the property on Source which its value needs to be assigned to targetPropName
            targetPropValue: 'optional, do not set if it does not apply',

            //how to interpret targetPropValue:  pure/ref/attribute
            targetPropValueMethod: 'optional, do not set if it does not apply',

            // how to update targetPropName with targetPropValue
            targetPolicy: 'assign/append',

            //optional, don't set if it doesn't apply
            sourcePropName: 'the name of the property on Source to be modified',

            //optional, don't set if it doesn't apply
            sourcePropValue: 'name of the property on Target which its value needs to be assigned to sourcePropName',

            //optional, defaults to "pure"
            sourcePropValueMethod: 'how to interpret sourcePropValue:  pure/ref/attribute',

            // how to update sourcePropName with sourcePropValue
            sourcePolicy: 'assign/append',

            // should the new value be added under "Properties" or be a new field on the affected object
            isProperty: 'true/false'
          }
        },
        properties: {
          optional: [
            {
              name: 'AccessLoggingPolicy',
              type: 'AccessLoggingPolicy',
              description: 'Captures detailed information for all requests made to your load balancer, such as the time a request was received, client’s IP address, latencies, request path, and server responses.'
            },
//            {
//              name: 'AppCookieStickinessPolicy',
//              type: 'AppCookieStickinessPolicy',
//              description: 'Generates one or more stickiness policies with sticky session lifetimes that follow that of an application-generated cookie. These policies can be associated only with HTTP/HTTPS listeners.'
//            },
            {
              name: 'AvailabilityZones',
              type: 'AvailabilityZones',
              description: 'The Availability Zones in which to create the load balancer. You can specify either AvailabilityZones or Subnets, but not both.'
            }
            /*
             ,
             {
             name: '',
             type: '',
             description:''
             },
             {
             name: '',
             type: '',
             description:''
             },
             {
             name: '',
             type: '',
             description:''
             },
             {
             name: '',
             type: '',
             description:''
             },
             {
             name: '',
             type: '',
             description:''
             },
             {
             name: '',
             type: '',
             description:''
             }
             */
          ]
        },
        outputs: [
          {
            type: 'acceptable values are Ref and GetAtt',
            name: 'userFriendlyNameOfOutput',
            description: 'userFriendlyDescriptionOfOutput'
          }
        ]
      }

    };

    this.propertyTypes = {
      primitives: {
        String: 'String', Integer: 'Integer', Boolean: 'Boolean'
      },
      complex: {

        TypeName: {

          //how to show this in UI
          Display: {
            type: 'allowable values are: table/drag/list',
            //the number of items that the table can possibly have
            maxSize: -1
          },
          Description: 'User Frindly Description',
          types: {
            required: [
              {
                name: 'key',
                type: 'type of subtype. If it is complex you need another typedef for it',
                description: 'The user friendly desc',
                // a list of allowable values
                allowableValues: [
                  {
                    'AMAZON_READABLE_VALUE': 'a user friendly name for the user to select'
                  },
                  {
                    'AMAZON_READABLE_VALUE': 'a user friendly name for the user to select'
                  }
                ],
                //the limit for the input
                limit: {min: 1, max: 10},
                // alist of default values
                default: ['a', 'b']

              }
            ],
            mutuallyExclusive: {
              A: [],
              B: []
            }
          }
        },

        AvailabilityZones: {

          //how to show this in UI
          Display: {
            type: 'list',
            //the number of items that the table can possibly have
            maxSize: -1
          },
          Description: 'The Availability Zones in which to create the load balancer.',
          types: {
            name: 'Region',
            type: 'String',
            description: 'a certain region',
            // a list of allowable values
            allowableValues: [
              {
                'ap-northeast-1b': 'Asia Pacific (Tokyo)'
              },
              {
                'ap-southeast-1b': 'Asia Pacific (Singapore)'
              },
              {
                'ap-southeast-2b': 'Asia Pacific (Sydney)'
              },
              {
                'eu-central-1b': 'EU (Frankfurt)'
              },
              {
                'eu-west-1b': 'EU (Ireland)'
              },
              {
                'sa-east-1b': 'South America (Sao Paulo)'
              },
              {
                'us-east-1b': 'US East (N. Virginia)'
              },
              {
                'us-west-1b': 'US West (N. California)'
              },
              {
                'us-west-2b': 'US West (Oregon)'
              }
            ]
          }
        },

        AccessLoggingPolicy: {
          //how to show this in UI
          Display: {
            type: 'table',
            //the number of items that the table can possibly have
            maxSize: 1
          },
          Description: 'where and how access logs are stored for the AWS::ElasticLoadBalancing::LoadBalancer resource',
          types: {
            required: [
              {
                name: 'Enabled',
                type: 'Boolean',
                description: 'Whether logging is enabled for the load balancer',
                //the limit for the input
                limit: {min: 5, max: 60}
              },
              {
                name: 'S3BucketName',
                type: 'String',
                description: 'The name of an Amazon S3 bucket where access log files are stored.'
              }
            ],
            optional: [
              {
                name: 'EmitInterval',
                type: 'Integer',
                description: 'The interval for publishing access logs in minutes. You can specify an interval of either 5 minutes or 60 minutes.',
                //the limit for the input
                limit: {min: 5, max: 60}
              },
              {
                name: 'S3BucketPrefix',
                type: 'String',
                description: 'A prefix for the all log object keys, such as my-load-balancer-logs/prod. If you store log files from multiple sources in a single bucket, you can use a prefix to distinguish each log file and its source.'
              }
            ]
          }
        },

        Tags: {
          Display: {type: 'table', maxSize: -1},
          Description: 'You can use the AWS CloudFormation Resource Tags property to apply tags to resources, which can help you identify and categorize those resources.',
          types: {
            required: [
              {
                name: 'Key',
                type: 'String',
                description: 'the key for the tag',
                default: ['S']
              },
              {
                name: 'Value',
                type: 'String',
                description: 'the value for a specific tag'
              }
            ]
          }
        },

        AttributeDefinitions: {
          Display: {type: 'table', maxSize: -1},
          Description: 'A list of AttributeName and AttributeType objects that describe the key schema for the table and indexes',
          types: {
            required: [
              {
                name: 'AttributeType',
                type: 'String',
                description: 'The data type for the attribute.',
                allowableValues: [
                  {'S': 'String'},
                  {'N': 'Number'},
                  {'B': 'Binary'}
                ],
                default: ['S']
              },
              {
                name: 'AttributeName',
                type: 'String',
                description: 'The name of an attribute. Attribute names can be 1 – 255 characters long and have no character restrictions.',
                limit: {min: 1, max: 255}
              }
            ]
          }
        },

        KeySchema: {
          Display: {type: 'table', maxSize: 2},
          Description: 'Specifies the attributes that make up the primary key for the table. The attributes in the KeySchema property must also be defined in the AttributeDefinitions property',
          types: {
            required: [
              {
                name: 'AttributeName',
                type: 'String',
                description: 'The attribute name that is used as the primary key for this table. Primary key element names can be 1 – 255 characters long and have no character restrictions.',
                limit: {min: 1, max: 255}
              },
              {
                name: 'KeyType',
                type: 'String',
                description: 'Represents the attribute data, consisting of the data type and the attribute value itself. You can specify HASH or RANGE.',
                allowableValues: [
                  {'HASH': 'Hash'},
                  {'RANGE': 'Range'}
                ]
              }
            ]
          }
        },

        ProvisionedThroughput: {
          Display: {type: 'table', maxSize: 1},
          Description: 'Throughput for the specified table, consisting of values for ReadCapacityUnits and WriteCapacityUnits. For more information about the contents of a Provisioned Throughput structure',
          types: {
            required: [
              {
                name: 'ReadCapacityUnits',
                type: 'Integer',
                description: 'Sets the desired minimum number of consistent reads of items (up to 1KB in size) per second for the specified table before Amazon DynamoDB balances the load.'
              },
              {
                name: 'WriteCapacityUnits',
                type: 'Integer',
                description: 'Sets the desired minimum number of consistent writes of items (up to 1KB in size) per second for the specified table before Amazon DynamoDB balances the load'
              }
            ]
          }
        },

        Projection: {
          Display: {type: 'table', maxSize: 1},
          Description: 'Attributes that are copied (projected) from the source table into the index. These attributes are additions to the primary key attributes and index key attributes, which are automatically projected.',
          types: {
            optional: [
              {
                name: 'NonKeyAttributes',
                type: 'String',
                description: 'The non-key attribute names that are projected into the index.For local secondary indexes, the total count of NonKeyAttributes summed across all of the local secondary indexes must not exceed 20. If you project the same attribute into two different indexes, this counts as two distinct attributes in determining the total.'
              },
              {
                name: 'ProjectionType',
                type: 'String',
                description: 'The set of attributes that are projected into the index: KEYS_ONLY: Only the index and primary keys are projected into the index. INCLUDE:  Only the specified table attributes are projected into the index. The list of projected attributes are in NonKeyAttributes. ALL:  All of the table attributes are projected into the index.',
                allowableValues: [
                  {'KEYS_ONLY': 'only keys'},
                  {'INCLUDE': 'include specified values'},
                  {'ALL': 'include everything'}
                ]
              }
            ]
          }
        },

        GlobalSecondaryIndexes: {
          Display: {type: 'drag', image: 'images/aws/localIndex.png', blockType: 'box'},
          Description: 'Global secondary indexes to be created on the table. You can create up to 5 global secondary indexes',
          types: {
            required: [

              {
                name: 'IndexName',
                type: 'String',
                description: 'The name of the global secondary index. The index name can be 3 – 255 characters long and have no character restrictions.',
                limit: {min: 3, max: 255}
              },
              {
                name: 'KeySchema',
                type: 'KeySchema',
                description: 'The complete index key schema for the global secondary index, which consists of one or more pairs of attribute names and key types.'
              },
              {
                name: 'Projection',
                type: 'Projection',
                description: 'Attributes that are copied (projected) from the source table into the index. These attributes are in addition to the primary key attributes and index key attributes, which are automatically projected.'
              },
              {
                name: 'ProvisionedThroughput',
                type: 'ProvisionedThroughput',
                description: 'The provisioned throughput settings for the index.'
              }
            ]
          }
        },

        LocalSecondaryIndexes: {
          Display: {type: 'drag', image: 'images/aws/globalIndex.png', blocktype: 'drag'},
          Description: 'Local secondary indexes to be created on the table. You can create up to 5 local secondary indexes. Each index is scoped to a given hash key value. The size of each hash key can be up to 10 gigabytes',
          types: {
            required: [
              {
                name: 'IndexName',
                type: 'String',
                description: 'The name of the local secondary index. The index name can be 3 – 255 characters long and have no character restrictions.',
                limit: {min: 3, max: 255}
              },
              {
                name: 'KeySchema',
                type: 'KeySchema',
                description: 'The complete index key schema for the local secondary index, which consists of one or more pairs of attribute names and key types. For local secondary indexes, the hash key must be the same as that of the source table.'
              },
              {
                name: 'Projection',
                type: 'Projection',
                description: 'Attributes that are copied (projected) from the source table into the index. These attributes are additions to the primary key attributes and index key attributes, which are automatically projected.'
              }
            ]
          }
        },

        BlockDeviceMappings: {
          Display: {type: 'drag', image: 'images/aws/blockDeviceMapping.png', blockType: 'drag'},
          Description: 'Amazon Elastic Block Store volume. You can choose to retain the volume, to delete the volume, or to create a snapshot of the volume.',
          types: {
            required: [
              {
                name: 'AvailabilityZone',
                type: 'String',
                description: '',
                allowableValues: [
                  {
                    'ap-northeast-1': 'Asia Pacific (Tokyo)'
                  },
                  {
                    'ap-southeast-1': 'Asia Pacific (Singapore)'
                  },
                  {
                    'ap-southeast-2': 'Asia Pacific (Sydney)'
                  },
                  {
                    'eu-central-1': 'EU (Frankfurt)'
                  },
                  {
                    'eu-west-1': 'EU (Ireland)'
                  },
                  {
                    'sa-east-1': 'South America (Sao Paulo)'
                  },
                  {
                    'us-east-1': 'US East (N. Virginia)'
                  },
                  {
                    'us-west-1': 'US West (N. California)'
                  },
                  {
                    'us-west-2': 'US West (Oregon)'
                  }
                ]

              }
            ],
            optional: [
              // TODO: some of these are conditionally required. we have to figure out how to handle them
              {
                name: 'Encrypted',
                type: 'Boolean',
                description: ''
              },
              {
                name: 'Iops',
                type: 'Number',
                description: ''
              },
              {

                name: 'Size',
                type: 'String',
                description: ''
              },
              {
                name: 'SnapshotId',
                type: 'String',
                description: ''
              },
              {
                name: 'Tags',
                type: 'Tags',
                description: 'An arbitrary set of tags (key–value pairs) for this volume.'
              },
              {
                name: 'VolumeType',
                type: 'String',
                description: ''
              }
            ]

          }
        },

        NetworkInterfaces: {
          Display: {type: 'drag', image: 'images/aws/networkInterface.png', blockType: 'drag'},
          Description: 'A network interface that is to be attached to the EC2 instance',
          types: {
            required: [
              {name: 'DeviceIndex', type: 'String', description: ''}
            ],
            optional: [
              {name: 'AssociatePublicIpAddress', type: 'Boolean', description: ''},
              {name: 'DeleteOnTermination', type: 'Boolean', description: ''},
              {name: 'Description', type: 'String', description: ''},
              {name: 'GroupSet', type: 'StringList', description: ''},
              {name: 'NetworkInterfaceId', type: 'String', description: ''},
              {name: 'PrivateIpAddress', type: 'String', description: ''},
              {name: 'PrivateIpAddresses', type: 'PrivateIpAddressSpecification', description: ''},
              {name: 'SecondaryPrivateIpAddressCount', type: 'Integer', description: ''},
              {name: 'SubnetId', type: 'String', description: ''}
            ]
          }

        },

        SecurityGroupIngress: {
          Display: {type: 'table', maxSize: -1},
          Description: 'Rules on incoming connections',
          types: {
            required: [
              {
                name: 'FromPort',
                type: 'Integer',
                description: 'The start of port range for the TCP and UDP protocols, or an ICMP type number. An ICMP type number of -1 indicates a wildcard (i.e., any ICMP type number)'
              },
              {
                name: 'ToPort',
                type: 'Integer',
                description: 'The end of port range for the TCP and UDP protocols, or an ICMP code. An ICMP code of -1 indicates a wildcard (i.e., any ICMP code).'
              },
              {
                name: 'IpProtocol',
                type: 'String',
                description: 'An IP protocol name or number',
                allowableValues: [
                  {'TCP': 'TCP'},
                  {'UDP': 'UDP'},
                  {'ICMP': 'ICMP'}
                ]
              }
            ],
            mutuallyExclusive: {
              A: [
                {
                  name: 'CidrIp',
                  type: 'String',
                  description: 'When you create a VPC, you specify the set of IP addresses for the VPC in the form of a Classless Inter-Domain Routing (CIDR) block (for example, 10.0.0.0/16)'
                }
              ],
              B: [
                {
                  name: 'SourceSecurityGroupId',
                  type: 'String',
                  description: 'For VPC security groups only. Specifies the ID of the Amazon EC2 Security Group to allow access. You can use the Ref intrinsic function to refer to the logical ID of a security group defined in the same template'
                },
                {
                  name: 'SourceSecurityGroupName',
                  type: 'String',
                  description: 'For non-VPC security groups only. Specifies the name of the Amazon EC2 Security Group to use for access. You can use the Ref intrinsic function to refer to the logical name of a security group that is defined in the same template'
                },
                {
                  name: 'SourceSecurityGroupOwnerId',
                  type: 'String',
                  description: 'Specifies the AWS Account ID of the owner of the Amazon EC2 Security Group that is specified in the SourceSecurityGroupName property.'
                }
              ]
            }
          }
        },

        SecurityGroupEgress: {
          Display: {type: 'table', maxSize: -1},
          Description: 'Rules on outgoing connections',
          types: {
            required: [
              {
                name: 'FromPort',
                type: 'Integer',
                description: 'The start of port range for the TCP and UDP protocols, or an ICMP type number. An ICMP type number of -1 indicates a wildcard (i.e., any ICMP type number)'
              },
              {
                name: 'ToPort',
                type: 'Integer',
                description: 'The end of port range for the TCP and UDP protocols, or an ICMP code. An ICMP code of -1 indicates a wildcard (i.e., any ICMP code).'
              },
              {
                name: 'IpProtocol',
                type: 'String',
                description: 'An IP protocol name or number',
                allowableValues: [
                  {'TCP': 'TCP'},
                  {'UDP': 'UDP'},
                  {'ICMP': 'ICMP'}
                ]
              }
            ],
            mutuallyExclusive: {
              A: [
                {
                  name: 'DestinationSecurityGroupId',
                  type: 'String',
                  description: 'Specifies the group ID of the destination Amazon VPC security group'
                }
              ],
              B: [
                {
                  name: 'CidrIp',
                  type: 'String',
                  description: 'When you create a VPC, you specify the set of IP addresses for the VPC in the form of a Classless Inter-Domain Routing (CIDR) block (for example, 10.0.0.0/16)'
                }
              ]
            }
          }
        },

        PrivateIpAddressSpecification: {
          Display: {type: 'table', maxSize: -1},
          Description: 'Private IP address specification',
          types: {
            required: [
              {
                name: 'Primary',
                type: 'Integer',
                description: 'Sets the private IP address as the primary private address. You can set only one primary private IP address. If you do not specify a primary private IP address, Amazon EC2 automatically assigns a primary private IP address'
              },
              {
                name: 'PrivateIpAddress',
                type: 'String',
                description: 'The private IP address of the network interface.'
              }
            ]
          }

        }

      }
    };
  }
)
;
