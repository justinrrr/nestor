/**
 *
 * Created by Fathalian on 10/29/14.
 */

'use strict';

var app = angular.module('nestorApp.services');
app.service('AWSComponents', function () {

    this.createInitialTemplate = function () {
      return {
        AWSTemplateFormatVersion: '2010-09-09',
        Description: 'Created By Nestor',
        Parameters: {},
        Mappings: {},
        Conditions: {},
        Resources: {},
        Outputs: {}
      };
    };
    this.tasks = [
      {
        name: 'Setup a machine and connect it to a DNS Address'
      },
      {
        name: 'Setup a VPC'
      },
      {
        name: 'Setup a machine and connect it to dynamoDB databases'
      },
      {
        name: 'Create a server cluster with ELBs'
      }
    ];

    this.components = [
      {
        name: 'Autoscaling Group',
        image: 'images/aws/autoscaling.png',
        description: 'Scale your EC2 capacity up or down automatically according to conditions you define'
      },
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
      {
        name: 'DynamoDb',
        image: 'images/aws/dynamo.png',
        description: 'NoSQL database service'
      },
      {
        name: 'EIP',
        image: 'images/aws/eip.png',
        description: 'Elastic IP'
      },
      //{
      //  name: 'EBS',
      //  image: 'images/aws/ebs.png',
      //  description: 'Persistent block level storage volumes for EC2 instances'
      //
      //},
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
      //{
      //  name: 'Elasticache',
      //  image: 'images/aws/elasticache.png',
      //  description: 'Deploy, operate, and scale an in-memory cache'
      //},
      {
        name: 'ELB',
        image: 'images/aws/elb.png',
        description: 'Automatically distributes incoming application traffic across multiple EC2 instances'
      },
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
      {
        name: 'route53',
        image: 'images/aws/route53.png',
        description: 'highly available and scalable Domain Name System (DNS)'
      },
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
      {
        name: 'SecurityGroup',
        image: 'images/aws/securityGroup.gif',
        description: 'Creates an Amazon EC2 security group'
      },
      {
        name: 'VPC',
        image: 'images/aws/vpc.png',
        description: 'Logically isolated section of the Cloud to launch resources in a virtual network that you define'
      }
    ];

    this.typeMappings = {
      'AWS::DynamoDB::Table': 'DynamoDb',
      'AWS::AutoScaling::AutoScalingGroup': 'Autoscaling Group',
      'AWS::EC2::Instance': 'EC2',
      'AWS::EC2::EIP': 'EIP',
      'AWS::ElasticLoadBalancing::LoadBalancer': 'ELB',
      'AWS::EC2::VPC': 'VPC',
      'AWS::EC2::SecurityGroup': 'SecurityGroup'
    };

    //add component specific metadat here
    this.componentMetadata = {

      'NameOfTheComponent': {
        type: 'AWS::Component::Table',
        // When the user drags a link from another object (Source) to connect it to this component (Target) use the following rules
        IncomingConnection: {

          'SourceComponentName': {    // e.g. EC2, DynamoDB
            overlays: [
              ['Arrow', {direction: -1, location: 0}],
              [ 'Label', { label: 'Depends On' }]
            ],

            //optional, don't set if it doesn't apply
            targetPropName: 'the name of the property on Target to be modified',

            //optional, don't set if it doesn't apply
            targetPropValue: 'name of the property on Source which its value needs to be assigned to targetPropName',

            //optional, defaults to "pure"
            targetPropValueMethod: 'how to interpret targetPropValue:  pure/ref/attribute',

            // how to update targetPropName with targetPropValue
            targetPolicy: 'assign/append',

            //optional, don't set if it doesn't apply
            sourcePropName: 'the name of the property on Source to be modified',

            //optional, don't set if it doesn't apply
            sourcePropValue: 'name of the property on Target which its value needs to be assigned to sourcePropName',

            //optional, defaults to "pure"
            sourcePropValueMethod: 'how to interpret sourcePropValue:  pure/ref/attribute',

            // how to update sourcePropName with sourcePropValue
            sourcePolicy: 'assign/append'

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
        Outputs: [
          {
            type: 'acceptable values are Ref and GetAtt',
            name: 'userFriendlyNameOfOutput',
            description: 'userFriendlyDescriptionOfOutput'
          }
        ]
      },

      'RecordSet': {
        type: 'AWS::Route53::RecordSet',
        // When the user drags a link from another object (Source) to connect it to this component (Target) use the following rules
        IncomingConnection: {

          'SourceComponentName': {    // e.g. EC2, DynamoDB
            overlays: [
              ['Arrow', {direction: -1, location: 0}],
              [ 'Label', { label: 'Depends On' }]
            ],

            //optional, don't set if it doesn't apply
            targetPropName: 'the name of the property on Target to be modified',

            //optional, don't set if it doesn't apply
            targetPropValue: 'name of the property on Source which its value needs to be assigned to targetPropName',

            //optional, defaults to "pure"
            targetPropValueMethod: 'how to interpret targetPropValue:  pure/ref/attribute',

            // how to update targetPropName with targetPropValue
            targetPolicy: 'assign/append',

            //optional, don't set if it doesn't apply
            sourcePropName: 'the name of the property on Source to be modified',

            //optional, don't set if it doesn't apply
            sourcePropValue: 'name of the property on Target which its value needs to be assigned to sourcePropName',

            //optional, defaults to "pure"
            sourcePropValueMethod: 'how to interpret sourcePropValue:  pure/ref/attribute',

            // how to update sourcePropName with sourcePropValue
            sourcePolicy: 'assign/append'

          }
        },
        properties: {
          required: [
            {
              name: 'HostedZoneName',
              type: 'String',
              description: 'The name of the domain for the hosted zone where you want to add the record set'
            },
            {
              name: 'Type',
              type: 'String',
              description: 'The type of records to add'
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
              type: 'String',
              description: 'The resource record cache time to live (TTL), in seconds'
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
        Outputs: [
          {
            type: 'acceptable values are Ref and GetAtt',
            name: 'userFriendlyNameOfOutput',
            description: 'userFriendlyDescriptionOfOutput'
          }
        ]
      },

      'SecurityGroup': {
        type: 'AWS::EC2::SecurityGroup',

        // When the user drags a link from another object (source) to connect it to this component (target) use the following rules
        IncomingConnection: {

          'EC2': {
            overlays: [
              ['Arrow', {direction: -1, location: 0}],
              [ 'Label', { label: 'Belongs to' }]
            ],

            //the name of the property on Source to be modified
            sourcePropName: 'SecurityGroups',

            //name of the property on Target which its value needs to be assigned to sourcePropName
            sourcePropValue: 'name',

            //how to interpret sourcePropValue:  pure/ref/attribute
            sourcePropValueMethod: 'ref',

            // how to update sourcePropName with sourcePropValue
            sourcePolicy: 'append'

          }
        },

        properties: {
          required: [
            {name: 'GroupDescription', type: 'String', description: 'Description of the security group'}
          ],
          optional: [
            {name: 'SecurityGroupEgress', type: 'SecurityGroupEgress', description: 'A list of Amazon EC2 security group outgoing connection rules'},
            {name: 'SecurityGroupIngress', type: 'SecurityGroupIngress', description: 'A list of Amazon EC2 security group incoming connection rules'},
            {name: 'Tags', type: 'Tags', description: 'The tags that you want to attach to the resource'}
            //TODO: take this item back when we add support for VPC
//          {name: 'VcpId', type: 'String', description: 'The physical ID of the VPC. Can be obtained by using a reference to an AWS::EC2::VPC, such as: { "Ref" : "myVPC" }'}
          ]
        },
        Outputs: [
          {
            type: 'Ref',
            name: 'security group identifier',
            description: 'the security group name (for EC2-classic) or the security group ID (for EC2-VPC)'
          }
        ]
      },

      'DynamoDb': {
        type: 'AWS::DynamoDB::Table',
        IncomingConnection: {
          //if dynamoDB got connected
          'DynamoDb': {
            overlays: [
              ['Arrow', {direction: -1, location: 0}],
              [ 'Label', { label: 'Depends On' }]
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
            targetPolicy: 'assign'
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

      'EC2': {
        type: 'AWS::EC2::Instance',

        IncomingConnection: {

          'SecurityGroup': {
            overlays: [
              ['Arrow', {direction: -1, location: 0}],
              [ 'Label', { label: 'Belongs' }]
            ],

            //the name of the property on Target to be modified
            targetPropName: 'SecurityGroups',

            //name of the property on Source which its value needs to be assigned to targetPropName
            targetPropValue: 'name',

            //how to interpret targetPropValue
            targetPropValueMethod: 'ref',

            // how to update targetPropName with targetPropValue
            targetPolicy: 'append'

          },

          'EIP': {    // e.g. EC2, DynamoDB
            overlays: [
              ['Arrow', {direction: 0, location: 0}],
              [ 'Label', { label: 'Depends On' }]
            ],

            //the name of the property on Source to be modified
            sourcePropName: 'InstanceId',

            //name of the property on Target which its value needs to be assigned to sourcePropName
            sourcePropValue: 'Name',

            //how to interpret sourcePropValue:  pure/ref/attribute
            sourcePropValueMethod: 'ref',

            // how to update sourcePropName with sourcePropValue
            sourcePolicy: 'assign'

          }

        },

        properties: {
          required: [
            {name: 'ImageId', type: 'String', description: 'Name of the EC2 instance'}
          ],
          optional: [

            {name: 'BlockDeviceMappings', type: 'BlockDeviceMappings', description: 'tooltip??'},
            {name: 'NetworkInterfaces', type: 'NetworkInterfaces', description: 'A list of NetworkInterface embedded objects that describe the network interfaces to associate with this instance'},
            {name: 'SecurityGroupIds', type: 'StringList', description: 'A list that contains the security group IDs for VPC security groups to assign to the Amazon EC2 instance. If you specified the NetworkInterfaces property, do not specify this property'},
            {name: 'SecurityGroups', type: 'StringList', description: 'Valid only for Amazon EC2 security groups. A list that contains the Amazon EC2 security groups to assign to the Amazon EC2 instance. The list can contain both the name of existing Amazon EC2 security groups or references to AWS::EC2::SecurityGroup resources created in the template'},
            {name: 'Tags', type: 'Tags', description: 'tooltip??'},
            {name: 'Volumes', type: 'Volumes', description: 'tooltip??'},

            {name: 'AvailabilityZone', type: 'String', description: 'Specifies the name of the Availability Zone in which the instance is located',
              // a list of allowable values
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

            },
            {name: 'DisableApiTermination', type: 'Boolean', description: 'Description for tooltip'},
            {name: 'EbsOptimized', type: 'Boolean', description: 'Description for tooltip'},
            {name: 'IamInstanceProfile', type: 'String', description: 'Description for tooltip'},
            {name: 'InstanceInitiatedShutdownBehavior', type: 'String', description: 'Description for tooltip'},
            {name: 'InstanceType', type: 'String', description: 'Description for tooltip'},
            {name: 'KernelId', type: 'String', description: 'Description for tooltip'},
            {name: 'KeyName', type: 'String', description: 'Description for tooltip'},
            {name: 'Monitoring', type: 'Boolean', description: 'Description for tooltip'},
            {name: 'PlacementGroupName', type: 'String', description: 'Description for tooltip'},
            {name: 'PrivateIpAddress', type: 'String', description: 'Description for tooltip'},
            {name: 'RamdiskId', type: 'String', description: 'Description for tooltip'},
            {name: 'SourceDestCheck', type: 'Boolean', description: 'Description for tooltip'},
            {name: 'SubnetId', type: 'String', description: 'Description for tooltip'},
            {name: 'Tenancy', type: 'String', description: 'Description for tooltip'},
            {name: 'UserData', type: 'String', description: 'Description for tooltip'}
          ]
        },
        Outputs: [
          {
            type: 'Ref',
            name: 'ImageID',
            description: 'Name of the EC2 instance'
          }
        ]
      },

      'EIP': {
        type: 'AWS::EC2::EIP',
        // When the user drags a link from another object (Source) to connect it to this component (Target) use the following rules
        IncomingConnection: {

          'EC2': {    // e.g. EC2, DynamoDB
            overlays: [
              ['Arrow', {direction: -1, location: 0}],
              [ 'Label', { label: 'PublicIP' }]
            ],

            //the name of the property on Target to be modified
            targetPropName: 'InstanceId',

            //name of the property on Source which its value needs to be assigned to targetPropName
            targetPropValue: 'Name',

            //how to interpret targetPropValue:  pure/ref/attribute
            targetPropValueMethod: 'ref',

            // how to update targetPropName with targetPropValue
            targetPolicy: 'assign'

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
        Outputs: [
          {
            type: 'Ref',
            name: 'Public IP',
            description: 'returns the value of the PublicIp for the EC2 instance'
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
            type: 'allowable values are table/drag',
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
                type: 'StringList',
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
          Display: {type: 'drag', image: 'images/aws/localIndex.png'},
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
          Display: {type: 'drag', image: 'images/aws/globalIndex.png'},
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
          Display: {type: 'drag', image: 'images/aws/blockDeviceMapping.png'},
          Description: 'Amazon Elastic Block Store volume. You can choose to retain the volume, to delete the volume, or to create a snapshot of the volume.',
          types: {
            required: [
              {
                name: 'AvailabilityZone',
                type: 'String',
                description: ''
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
          Display: {type: 'drag', image: 'images/aws/networkInterface.png'},
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
              {name: 'FromPort', type: 'Integer', description: 'The start of port range for the TCP and UDP protocols, or an ICMP type number. An ICMP type number of -1 indicates a wildcard (i.e., any ICMP type number)'},
              {name: 'toPort', type: 'Integer', description: 'The end of port range for the TCP and UDP protocols, or an ICMP code. An ICMP code of -1 indicates a wildcard (i.e., any ICMP code).'},
              {name: 'IpProtocol', type: 'String', description: 'An IP protocol name or number'}
            ],
            mutuallyExclusive: {
              A: [
                {name: 'CidrIp', type: 'String', description: 'When you create a VPC, you specify the set of IP addresses for the VPC in the form of a Classless Inter-Domain Routing (CIDR) block (for example, 10.0.0.0/16)'}
              ],
              B: [
                {name: 'SourceSecurityGroupId', type: 'String', description: 'For VPC security groups only. Specifies the ID of the Amazon EC2 Security Group to allow access. You can use the Ref intrinsic function to refer to the logical ID of a security group defined in the same template'},
                {name: 'SourceSecurityGroupName', type: 'String', description: 'For non-VPC security groups only. Specifies the name of the Amazon EC2 Security Group to use for access. You can use the Ref intrinsic function to refer to the logical name of a security group that is defined in the same template'},
                {name: 'SourceSecurityGroupOwnerId', type: 'String', description: 'Specifies the AWS Account ID of the owner of the Amazon EC2 Security Group that is specified in the SourceSecurityGroupName property.'}
              ]
            }
          }
        },

        SecurityGroupEgress: {
          Display: { type: 'table', maxSize: -1 },
          Description: 'Rules on outgoing connections',
          types: {
            required: [
              {name: 'FromPort', type: 'Integer', description: 'The start of port range for the TCP and UDP protocols, or an ICMP type number. An ICMP type number of -1 indicates a wildcard (i.e., any ICMP type number)'},
              {name: 'toPort', type: 'Integer', description: 'The end of port range for the TCP and UDP protocols, or an ICMP code. An ICMP code of -1 indicates a wildcard (i.e., any ICMP code).'},
              {name: 'IpProtocol', type: 'String', description: 'An IP protocol name or number'}
            ],
            mutuallyExclusive: {
              A: [
                {name: 'DestinationSecurityGroupId', type: 'String', description: 'Specifies the group ID of the destination Amazon VPC security group'}
              ],
              B: [
                {name: 'CidrIp', type: 'String', description: 'When you create a VPC, you specify the set of IP addresses for the VPC in the form of a Classless Inter-Domain Routing (CIDR) block (for example, 10.0.0.0/16)'}
              ]
            }
          }
        },

        PrivateIpAddressSpecification: {
          Display: { type: 'table', maxSize: -1 },
          Description: 'Private IP address specification',
          types: {
            required: [
              {name: 'Primary', type: 'Integer', description: 'Sets the private IP address as the primary private address. You can set only one primary private IP address. If you do not specify a primary private IP address, Amazon EC2 automatically assigns a primary private IP address'},
              {name: 'PrivateIpAddress', type: 'String', description: 'The private IP address of the network interface.'}
            ]
          }

        }

      }
    };
  }
)
;
