/**
 *
 * Created by Fathalian on 10/29/14.
 */

'use strict';

var app = angular.module('nestorApp.services');
app.service('AWSComponents', function () {

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
        name: 'VPC',
        image: 'images/aws/vpc.png',
        description: 'Logically isolated section of the Cloud to launch resources in a virtual network that you define'
      }
    ];

    //add component specific metadat here
    this.componentMetadata = {
      'DynamoDb': {
        type: 'AWS::DynamoDB::Table',
        IncomingConnection: {
          //if dynamoDB got connected
          'DynamoDb': {
            //set a field named 'DependsOn'
          name: 'DependsOn',
            //to the 'Name' property of the connected DynamoDB
          value: 'Name',
            //its not in the properties
          isProperty: false}},
        properties: {
          required: [
            {name: 'TableName', description: 'name of the table', type: 'String'},
            {name: 'AttributeDefinitions', type: 'AttributeDefinitions'},
            {name: 'KeySchema', type: 'KeySchema'},
            {name: 'ProvisionedThroughput' , type: 'ProvisionedThroughput'}
          ],
          optional: [
            {name: 'GlobalSecondaryIndexes', type : 'GlobalSecondaryIndexes'},
            {name: 'LocalSecondaryIndexes', type: 'LocalSecondaryIndexes'}
          ]
        },
        outputs: [
          {
            type: 'Ref',
            name: 'TableName',
            description: 'Name of the created DynamoDb Table'
          }]
      },

      'EC2' : {
        type: 'AWS::EC2::Instance',
        properties: {
          required: {
            ImageId : 'String'
          },
          optional: {
            AvailabilityZone : 'String',
//            BlockDeviceMappings : 'BlockDeviceMappings' //[ EC2 Block Device Mapping, ... ],
            DisableApiTermination : 'Boolean',
            EbsOptimized : 'Boolean',
            IamInstanceProfile : 'String',
            InstanceInitiatedShutdownBehavior : 'default',
            InstanceType : 'String',
            KernelId : 'String',
            KeyName : 'String',
            Monitoring : 'Boolean',
//            NetworkInterfaces : 'NetworkInterfaces' // [ EC2 Network Interface, ... ],
            PlacementGroupName : 'String',
            PrivateIpAddress : 'String',
            RamdiskId : 'String',
//          SecurityGroupIds : [ String, ... ],
//          SecurityGroups : [ String, ... ],
            SourceDestCheck : 'Boolean',
            SubnetId : 'String',
//          Tags : [ Resource Tag, ... ],
            Tenancy : 'String',
//          Volumes : [ EC2 MountPoint, ... ],
            UserData : 'String'
          }
        },
        outputs: [
          {
            type: 'Ref',
            name: 'ImageID',
            description: 'Name of the EC2 instanced'
          }]
      },

      'EBS' : {
        type: 'AWS::EC2::Volume',
        properties: {
          required: {
            AvailabilityZone : 'String'
          },
          optional: {
            // TODO: some of these are conditionally required. we have to figure out how to handle them
            Encrypted : 'Boolean',
            Iops : 'Number',
            Size : 'String',
            SnapshotId : 'String',
//          Tags : [ Resource Tag, ... ],
            VolumeType : 'String'
          }
        },
        outputs: [ ]
      }

      /* template for a new component meta data
      '' : {
        "type": '',
        properties: {
          required: {

          },
          optional: {

          }
        },
        outputs: [ {}]
      }
      */


    };

    this.propertyTypes = {
      primitives: {
        String: 'String', Integer: 'Integer', Boolean: 'Boolean'
      },
      complex: {
        AttributeDefinitions: {
          Display: {type: 'table', maxSize: -1},
          Description: 'A list of AttributeName and AttributeType objects that describe the key schema for the table and indexes',
          types: {
            required: {

              AttributeType: {
                type: 'String',
                description: 'The data type for the attribute.',
                allowableValues: [{'S': 'String'}, {'N': 'Number'}, {'B': 'Binary'}],
                default: ['S']
              },
              AttributeName: {
                type: 'String',
                description: 'The name of an attribute. Attribute names can be 1 – 255 characters long and have no character restrictions.',
                limit: {min: 1, max: 255}
              }
            }
          }
        },

        KeySchema: {
          Display: {type: 'table', maxSize: 2},
          Description: 'Specifies the attributes that make up the primary key for the table. The attributes in the KeySchema property must also be defined in the AttributeDefinitions property',
          types: {
            required: {
              AttributeName: {
                type: 'String',
                description: 'The attribute name that is used as the primary key for this table. Primary key element names can be 1 – 255 characters long and have no character restrictions.',
                limit: {min: 1, max: 255}
              },
              KeyType: {
                type: 'String',
                description: 'Represents the attribute data, consisting of the data type and the attribute value itself. You can specify HASH or RANGE.',
                allowableValues: [{'HASH': 'Hash'}, {'RANGE': 'Range'}]
              }
            }
          }
        },

        ProvisionedThroughput: {
          Display: {type: 'table', maxSize: 1},
          Description: 'Throughput for the specified table, consisting of values for ReadCapacityUnits and WriteCapacityUnits. For more information about the contents of a Provisioned Throughput structure',
          types: {
            required: {
              ReadCapacityUnits: {
                type: 'Integer',
                description: 'Sets the desired minimum number of consistent reads of items (up to 1KB in size) per second for the specified table before Amazon DynamoDB balances the load.'
              },
              WriteCapacityUnits: {
                type: 'Integer',
                description: 'Sets the desired minimum number of consistent writes of items (up to 1KB in size) per second for the specified table before Amazon DynamoDB balances the load'
              }
            }
          }
        },

        Projection: {
          Display: {type: 'table', maxSize: 1},
          Description: 'Attributes that are copied (projected) from the source table into the index. These attributes are additions to the primary key attributes and index key attributes, which are automatically projected.',
          types: {
            optional: {
              NonKeyAttributes: {
                type: 'StringList',
                description: 'The non-key attribute names that are projected into the index.For local secondary indexes, the total count of NonKeyAttributes summed across all of the local secondary indexes must not exceed 20. If you project the same attribute into two different indexes, this counts as two distinct attributes in determining the total.'
              },
              ProjectionType: {
                type: 'String',
                description: 'The set of attributes that are projected into the index: KEYS_ONLY: Only the index and primary keys are projected into the index. INCLUDE:  Only the specified table attributes are projected into the index. The list of projected attributes are in NonKeyAttributes. ALL:  All of the table attributes are projected into the index.',
                allowableValues: [{'KEYS_ONLY': 'only keys'}, {'INCLUDE': 'include specified values'}, {'ALL': 'include everything'}]
              }
            }
          }
        },

        GlobalSecondaryIndexes: {
          Display: {type: 'drag', image: 'images/aws/localIndex.png'},
          Description: 'Global secondary indexes to be created on the table. You can create up to 5 global secondary indexes',
          types: {
            required: {
              IndexName: {
                type: 'String',
                description: 'The name of the global secondary index. The index name can be 3 – 255 characters long and have no character restrictions.',
                limit: {min: 3, max: 255}
              },
              KeySchema: {
                type: 'KeySchema',
                description: 'The complete index key schema for the global secondary index, which consists of one or more pairs of attribute names and key types.'
              },
              Projection: {
                type: 'Projection',
                description: 'Attributes that are copied (projected) from the source table into the index. These attributes are in addition to the primary key attributes and index key attributes, which are automatically projected.'
              },
              ProvisionedThroughput: {
                type: 'ProvisionedThroughput',
                description: 'The provisioned throughput settings for the index.'
              }
            }
          }
        },

        LocalSecondaryIndexes: {
          Display: {type: 'drag', image: 'images/aws/globalIndex.png'},
          Description: 'Local secondary indexes to be created on the table. You can create up to 5 local secondary indexes. Each index is scoped to a given hash key value. The size of each hash key can be up to 10 gigabytes',
          types: {
            required: {

              IndexName: {
                type: 'String',
                description: 'The name of the local secondary index. The index name can be 3 – 255 characters long and have no character restrictions.',
                limit: {min: 3, max: 255}
              },
              KeySchema: {
                type: 'KeySchema',
                description: 'The complete index key schema for the local secondary index, which consists of one or more pairs of attribute names and key types. For local secondary indexes, the hash key must be the same as that of the source table.'
              },
              Projection: {
                type: 'Projection',
                description: 'Attributes that are copied (projected) from the source table into the index. These attributes are additions to the primary key attributes and index key attributes, which are automatically projected.'
              }
            }
          }
        },

        BlockDeviceMappings: {}

      }
    };
  }
)
;
