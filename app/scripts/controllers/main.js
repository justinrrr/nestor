'use strict';

angular.module('nestorApp')
  .controller('MainCtrl',
  ['$scope', '$rootScope', '$modal', 'AWSComponents', 'CFTemplate', 'UIComponents',
    'ConnectionUtils', '$window', '$analytics',
    'CanvasModel',
    function ($scope, $rootScope, $modal, AWSComponents, CFTemplate, UIComponents, ConnectionUtils, $window, $analytics, CanvasModel) {

      $scope.zoomFactor = 1;
      $scope.debug = true;
      $scope.isBottomLeftOpen = false;
      $scope.isLeftOpen = false;
      $scope.isPropertiesShowing = false;

      UIComponents.setupJSPlumb($scope);
      $scope.canvasModel = CanvasModel;

      //create the main data model variables. All of these must be serialized
      //and deserialized for saving of an item
      $scope.templateString = CFTemplate.getStringFormat();
      $scope.privateTemplate = CFTemplate.getPrivateTemplate();


      // some aliases for UI representation of the data model
      $scope.components = AWSComponents.components;

      $scope.componentMetadata = AWSComponents.componentMetadata;
      $scope.types = AWSComponents.propertyTypes;
      $scope.tasks = AWSComponents.tasks;

      $scope.leftPanelOptions = [
        //{
        //  name: 'Tasks',
        //  visible: true,
        //  image: 'images/solutions.png'
        //},
        {name: 'Components', visible: true, image: 'images/solution.png'},
        {name: 'Properties', visible: 'false', image: 'images/properties.png'}
      ];
      //UI State
      $scope.isShowingTop = true;

      //--------------------------------------
      // Helpers functions
      //--------------------------------------
      function generateComponentName(type) {
        if (!CanvasModel.componentNameCounters.type) {
          CanvasModel.componentNameCounters.type = 1;
        }
        var counter = CanvasModel.componentNameCounters.type;
        CanvasModel.componentNameCounters.type++;
        return type + counter;
      }

      function itemSelected(component) {
        $scope.selectedComponent = component;
        $scope.isPropertiesShowing = true;
        selectElementInEditor(component.name);
      }

      function addComponent(blueprint, posX, posY) {

        var uniqueId = generateComponentName(blueprint.name);
        var c = new UIComponents.Component(
          uniqueId,
          blueprint.type,
          uniqueId,
          blueprint.image,
          $scope.componentMetadata[blueprint.type].properties.required,
          $scope.componentMetadata[blueprint.type].properties.optional,
          blueprint.description,
          posX,
          posY);

        c.blockType = blueprint.blockType;
        CanvasModel.addedComponents[c.name] = c;

        var aMetadata = $scope.componentMetadata[blueprint.type];
        CFTemplate.addResource(c.name, aMetadata.type, aMetadata.outputs);

        // select the newly added item
        itemSelected(c);
      }


      //--------------------------------------
      // UI Events
      //--------------------------------------

      $scope.zoomIn = function () {
        $scope.zoomFactor = $scope.zoomFactor + 0.2;
        setZoom();
      };

      $scope.zoomOut = function () {

        $scope.zoomFactor = $scope.zoomFactor - 0.2;
        if ($scope.zoomFactor < 0) {
          $scope.zoomFactor = 0.1;
        }
        setZoom();
      };

      function setZoom() {
        var el = jsPlumb.getContainer();
        var p = [ 'webkit', 'moz', 'ms', 'o' ],
          s = 'scale(' + $scope.zoomFactor + ')';

        for (var i = 0; i < p.length; i++) {
          el.style[p[i] + 'Transform'] = s;
        }

        el.style.transform = s;

        jsPlumb.setZoom($scope.zoomFactor);
      }

      $scope.linkActivated = function (option) {
        //when someone closes the submenu, we want the active state to disappear
        $scope.selectedOption = option.name;


      };

      $scope.closeLeft = function () {

        $scope.isLeftOpen = false;
        delete $scope.selectedOption;
        $rootScope.$broadcast('leftmostResizeRequest');
      };

      $scope.optionPressed = function (option) {

        switch (option.name) {
          case 'Components':
            $scope.showTasks = false;
            $scope.showProperties = false;
            $scope.showComponents = true;
            break;
          case 'Tasks' :
            $scope.showTasks = true;
            $scope.showProperties = false;
            $scope.showComponents = false;
            break;
          case 'Properties' :
            $scope.showTasks = false;
            $scope.showProperties = true;
            $scope.showComponents = false;
            break;
          default:
            break;
        }

        if (!$scope.isLeftOpen) {
          $scope.isLeftOpen = true;
          $rootScope.$broadcast('leftmostResizeRequest');
        }
      };

      $scope.componentPressed = function (component) {
        $scope.isShowingTop = false;
        $scope.nestedComponent = component;
      };

      $scope.componentBackPressed = function () {
        $scope.isShowingTop = true;
      };

      $scope.onDragComplete = function ($data, $event) {

        //because of the fucking directive for ui layout
        //I need to use jquery here to compensate for the extra offset
        //caused by the editor
        var rightPanelWidth = angular.element('#left-panel')[0].clientWidth;

        addComponent($data, $event.x - rightPanelWidth - 85, $event.y - 50);

        $analytics.eventTrack('dragged', {componentName: $data.type});
      };

      $scope.taskSelected = function (task) {
        CFTemplate.setTemplate(task.template);
        CanvasModel.addedComponents = task.components;
        CanvasModel.connections = task.connections;

        _.each(CanvasModel.connections, function (targets, sourceName) {
          _.each(targets, function (targetName) {
            UIComponents.connectComponents(sourceName, targetName, false);
          });
        });

        $analytics.eventTrack('solutionPicked');

      };

      $scope.showModal = function () {
        var modalInstance = $modal.open({
          templateUrl: '../templates/modal_view.html',
          controller: 'LoadInfrastructure',
          size: 'lg'
        });

        modalInstance.result.then(
          function () {
            CanvasModel.addedComponents = {
                "EC21": {
                  "id": "EC21",
                  "type": "AWS::EC2::Instance",
                  "name": "EC21",
                  "description": "Resizable compute machines",
                  "image": "images/aws/ec2.png",
                  "x": 147,
                  "y": 307,
                  "required": [
                    {
                      "name": "ImageId",
                      "type": "String",
                      "description": "Name of the EC2 instance",
                      "allowableValues": [
                        {
                          "ami-77581047": "Stewie"
                        },
                        {
                          "ami-67334857": "Jenkins"
                        },
                        {
                          "ami-67334857": "MyCustomAmi"
                        },
                        {
                          "dummy": "---Standard AMIs---"
                        },
                        {
                          "ami-b5a7ea85": "Amazon Linux AMI 2014.09.1 (HVM)"
                        },
                        {
                          "ami-99bef1a9": "Red Hat Enterprise Linux 7.0 (HVM)"
                        },
                        {
                          "ami-d7450be7": "SuSE Linux Enterprise Server 12 (HVM)"
                        },
                        {
                          "ami-3d50120d": "Ubuntu Server 14.04 LTS (HVM)"
                        },
                        {
                          "ami-21f0bc11": "Microsoft Windows Server 2012 R2 Base"
                        }
                      ]
                    }
                  ],
                  "optional": [
                    {
                      "name": "BlockDeviceMappings",
                      "type": "BlockDeviceMappings",
                      "description": "tooltip??"
                    },
                    {
                      "name": "NetworkInterfaces",
                      "type": "NetworkInterfaces",
                      "description": "A list of NetworkInterface embedded objects that describe the network interfaces to associate with this instance"
                    },
                    {
                      "name": "SecurityGroupIds",
                      "type": "StringList",
                      "description": "A list that contains the security group IDs for VPC security groups to assign to the Amazon EC2 instance. If you specified the NetworkInterfaces property, do not specify this property"
                    },
                    {
                      "name": "SecurityGroups",
                      "type": "StringList",
                      "description": "Valid only for Amazon EC2 security groups. A list that contains the Amazon EC2 security groups to assign to the Amazon EC2 instance. The list can contain both the name of existing Amazon EC2 security groups or references to AWS::EC2::SecurityGroup resources created in the template"
                    },
                    {
                      "name": "Tags",
                      "type": "Tags",
                      "description": "tooltip??"
                    },
                    {
                      "name": "Volumes",
                      "type": "Volumes",
                      "description": "tooltip??"
                    },
                    {
                      "name": "AvailabilityZone",
                      "type": "String",
                      "description": "Specifies the name of the Availability Zone in which the instance is located",
                      "allowableValues": [
                        {
                          "ap-northeast-1b": "Asia Pacific (Tokyo)"
                        },
                        {
                          "ap-southeast-1b": "Asia Pacific (Singapore)"
                        },
                        {
                          "ap-southeast-2b": "Asia Pacific (Sydney)"
                        },
                        {
                          "eu-central-1b": "EU (Frankfurt)"
                        },
                        {
                          "eu-west-1b": "EU (Ireland)"
                        },
                        {
                          "sa-east-1b": "South America (Sao Paulo)"
                        },
                        {
                          "us-east-1b": "US East (N. Virginia)"
                        },
                        {
                          "us-west-1b": "US West (N. California)"
                        },
                        {
                          "us-west-2b": "US West (Oregon)"
                        }
                      ]
                    },
                    {
                      "name": "InstanceType",
                      "type": "String",
                      "description": "Description for tooltip",
                      "allowableValues": [
                        {
                          "t2.micro": "t2.micro"
                        },
                        {
                          "t2.small": "t2.small"
                        },
                        {
                          "t2.medium": "t2.medium"
                        },
                        {
                          "m3.medium": "m3.medium"
                        },
                        {
                          "m3.large": "m3.large"
                        },
                        {
                          "m3.xlarge": "m3.xlarge"
                        },
                        {
                          "m3.2xlarge": "m3.2xlarge"
                        },
                        {
                          "c3.large": "c3.large"
                        },
                        {
                          "c3.xlarge": "c3.xlarge"
                        },
                        {
                          "c3.2xlarge": "c3.2xlarge"
                        },
                        {
                          "c3.4xlarge": "c3.4xlarge"
                        },
                        {
                          "c3.8xlarge": " c3.8xlarge"
                        },
                        {
                          "r3.large": "r3.large"
                        },
                        {
                          "r3.xlarge": "r3.xlarge"
                        },
                        {
                          "r3.2xlarge": "r3.2xlarge"
                        },
                        {
                          "r3.4xlarge": "r3.4xlarge"
                        },
                        {
                          "r3.8xlarge": "r3.8xlarge"
                        },
                        {
                          "i2.xlarge": "i2.xlarge"
                        },
                        {
                          "i2.2xlarge": "i2.2xlarge"
                        },
                        {
                          "i2.4xlarge": "i2.4xlarge"
                        },
                        {
                          "i2.8xlarge": "i2.8xlarge"
                        },
                        {
                          "hs1.8xlarge": "hs1.8xlarge"
                        },
                        {
                          "g2.2xlarge": "g2.2xlarge"
                        }
                      ]
                    },
                    {
                      "name": "KeyName",
                      "type": "String",
                      "description": "Description for tooltip"
                    },
                    {
                      "name": "EbsOptimized",
                      "type": "Boolean",
                      "description": "Description for tooltip"
                    },
                    {
                      "name": "IamInstanceProfile",
                      "type": "String",
                      "description": "Description for tooltip"
                    },
                    {
                      "name": "DisableApiTermination",
                      "type": "Boolean",
                      "description": "Description for tooltip"
                    },
                    {
                      "name": "KernelId",
                      "type": "String",
                      "description": "Description for tooltip"
                    },
                    {
                      "name": "Monitoring",
                      "type": "Boolean",
                      "description": "Description for tooltip"
                    },
                    {
                      "name": "InstanceInitiatedShutdownBehavior",
                      "type": "String",
                      "description": "Description for tooltip"
                    },
                    {
                      "name": "PlacementGroupName",
                      "type": "String",
                      "description": "Description for tooltip"
                    },
                    {
                      "name": "PrivateIpAddress",
                      "type": "String",
                      "description": "Description for tooltip"
                    },
                    {
                      "name": "RamdiskId",
                      "type": "String",
                      "description": "Description for tooltip"
                    },
                    {
                      "name": "SourceDestCheck",
                      "type": "Boolean",
                      "description": "Description for tooltip"
                    },
                    {
                      "name": "SubnetId",
                      "type": "String",
                      "description": "Description for tooltip"
                    },
                    {
                      "name": "Tenancy",
                      "type": "String",
                      "description": "Description for tooltip",
                      "allowableValues": [
                        {
                          "default": "default"
                        },
                        {
                          "dedicated": "dedicated"
                        }
                      ]
                    },
                    {
                      "name": "UserData",
                      "type": "String",
                      "description": "Description for tooltip"
                    }
                  ],
                  "parent": "",
                  "blockType": "box"
                },
                "EC22": {
                  "id": "EC22",
                  "type": "AWS::EC2::Instance",
                  "name": "EC22",
                  "description": "Resizable compute machines",
                  "image": "images/aws/ec2.png",
                  "x": 383,
                  "y": 298,
                  "required": [
                    {
                      "name": "ImageId",
                      "type": "String",
                      "description": "Name of the EC2 instance",
                      "allowableValues": [
                        {
                          "ami-77581047": "Stewie"
                        },
                        {
                          "ami-67334857": "Jenkins"
                        },
                        {
                          "ami-67334857": "MyCustomAmi"
                        },
                        {
                          "dummy": "---Standard AMIs---"
                        },
                        {
                          "ami-b5a7ea85": "Amazon Linux AMI 2014.09.1 (HVM)"
                        },
                        {
                          "ami-99bef1a9": "Red Hat Enterprise Linux 7.0 (HVM)"
                        },
                        {
                          "ami-d7450be7": "SuSE Linux Enterprise Server 12 (HVM)"
                        },
                        {
                          "ami-3d50120d": "Ubuntu Server 14.04 LTS (HVM)"
                        },
                        {
                          "ami-21f0bc11": "Microsoft Windows Server 2012 R2 Base"
                        }
                      ]
                    }
                  ],
                  "optional": [
                    {
                      "name": "BlockDeviceMappings",
                      "type": "BlockDeviceMappings",
                      "description": "tooltip??"
                    },
                    {
                      "name": "NetworkInterfaces",
                      "type": "NetworkInterfaces",
                      "description": "A list of NetworkInterface embedded objects that describe the network interfaces to associate with this instance"
                    },
                    {
                      "name": "SecurityGroupIds",
                      "type": "StringList",
                      "description": "A list that contains the security group IDs for VPC security groups to assign to the Amazon EC2 instance. If you specified the NetworkInterfaces property, do not specify this property"
                    },
                    {
                      "name": "SecurityGroups",
                      "type": "StringList",
                      "description": "Valid only for Amazon EC2 security groups. A list that contains the Amazon EC2 security groups to assign to the Amazon EC2 instance. The list can contain both the name of existing Amazon EC2 security groups or references to AWS::EC2::SecurityGroup resources created in the template"
                    },
                    {
                      "name": "Tags",
                      "type": "Tags",
                      "description": "tooltip??"
                    },
                    {
                      "name": "Volumes",
                      "type": "Volumes",
                      "description": "tooltip??"
                    },
                    {
                      "name": "AvailabilityZone",
                      "type": "String",
                      "description": "Specifies the name of the Availability Zone in which the instance is located",
                      "allowableValues": [
                        {
                          "ap-northeast-1b": "Asia Pacific (Tokyo)"
                        },
                        {
                          "ap-southeast-1b": "Asia Pacific (Singapore)"
                        },
                        {
                          "ap-southeast-2b": "Asia Pacific (Sydney)"
                        },
                        {
                          "eu-central-1b": "EU (Frankfurt)"
                        },
                        {
                          "eu-west-1b": "EU (Ireland)"
                        },
                        {
                          "sa-east-1b": "South America (Sao Paulo)"
                        },
                        {
                          "us-east-1b": "US East (N. Virginia)"
                        },
                        {
                          "us-west-1b": "US West (N. California)"
                        },
                        {
                          "us-west-2b": "US West (Oregon)"
                        }
                      ]
                    },
                    {
                      "name": "InstanceType",
                      "type": "String",
                      "description": "Description for tooltip",
                      "allowableValues": [
                        {
                          "t2.micro": "t2.micro"
                        },
                        {
                          "t2.small": "t2.small"
                        },
                        {
                          "t2.medium": "t2.medium"
                        },
                        {
                          "m3.medium": "m3.medium"
                        },
                        {
                          "m3.large": "m3.large"
                        },
                        {
                          "m3.xlarge": "m3.xlarge"
                        },
                        {
                          "m3.2xlarge": "m3.2xlarge"
                        },
                        {
                          "c3.large": "c3.large"
                        },
                        {
                          "c3.xlarge": "c3.xlarge"
                        },
                        {
                          "c3.2xlarge": "c3.2xlarge"
                        },
                        {
                          "c3.4xlarge": "c3.4xlarge"
                        },
                        {
                          "c3.8xlarge": " c3.8xlarge"
                        },
                        {
                          "r3.large": "r3.large"
                        },
                        {
                          "r3.xlarge": "r3.xlarge"
                        },
                        {
                          "r3.2xlarge": "r3.2xlarge"
                        },
                        {
                          "r3.4xlarge": "r3.4xlarge"
                        },
                        {
                          "r3.8xlarge": "r3.8xlarge"
                        },
                        {
                          "i2.xlarge": "i2.xlarge"
                        },
                        {
                          "i2.2xlarge": "i2.2xlarge"
                        },
                        {
                          "i2.4xlarge": "i2.4xlarge"
                        },
                        {
                          "i2.8xlarge": "i2.8xlarge"
                        },
                        {
                          "hs1.8xlarge": "hs1.8xlarge"
                        },
                        {
                          "g2.2xlarge": "g2.2xlarge"
                        }
                      ]
                    },
                    {
                      "name": "KeyName",
                      "type": "String",
                      "description": "Description for tooltip"
                    },
                    {
                      "name": "EbsOptimized",
                      "type": "Boolean",
                      "description": "Description for tooltip"
                    },
                    {
                      "name": "IamInstanceProfile",
                      "type": "String",
                      "description": "Description for tooltip"
                    },
                    {
                      "name": "DisableApiTermination",
                      "type": "Boolean",
                      "description": "Description for tooltip"
                    },
                    {
                      "name": "KernelId",
                      "type": "String",
                      "description": "Description for tooltip"
                    },
                    {
                      "name": "Monitoring",
                      "type": "Boolean",
                      "description": "Description for tooltip"
                    },
                    {
                      "name": "InstanceInitiatedShutdownBehavior",
                      "type": "String",
                      "description": "Description for tooltip"
                    },
                    {
                      "name": "PlacementGroupName",
                      "type": "String",
                      "description": "Description for tooltip"
                    },
                    {
                      "name": "PrivateIpAddress",
                      "type": "String",
                      "description": "Description for tooltip"
                    },
                    {
                      "name": "RamdiskId",
                      "type": "String",
                      "description": "Description for tooltip"
                    },
                    {
                      "name": "SourceDestCheck",
                      "type": "Boolean",
                      "description": "Description for tooltip"
                    },
                    {
                      "name": "SubnetId",
                      "type": "String",
                      "description": "Description for tooltip"
                    },
                    {
                      "name": "Tenancy",
                      "type": "String",
                      "description": "Description for tooltip",
                      "allowableValues": [
                        {
                          "default": "default"
                        },
                        {
                          "dedicated": "dedicated"
                        }
                      ]
                    },
                    {
                      "name": "UserData",
                      "type": "String",
                      "description": "Description for tooltip"
                    }
                  ],
                  "parent": "",
                  "blockType": "box"
                },
                "EC23": {
                  "id": "EC23",
                  "type": "AWS::EC2::Instance",
                  "name": "EC23",
                  "description": "Resizable compute machines",
                  "image": "images/aws/ec2.png",
                  "x": 646,
                  "y": 287,
                  "required": [
                    {
                      "name": "ImageId",
                      "type": "String",
                      "description": "Name of the EC2 instance",
                      "allowableValues": [
                        {
                          "ami-77581047": "Stewie"
                        },
                        {
                          "ami-67334857": "Jenkins"
                        },
                        {
                          "ami-67334857": "MyCustomAmi"
                        },
                        {
                          "dummy": "---Standard AMIs---"
                        },
                        {
                          "ami-b5a7ea85": "Amazon Linux AMI 2014.09.1 (HVM)"
                        },
                        {
                          "ami-99bef1a9": "Red Hat Enterprise Linux 7.0 (HVM)"
                        },
                        {
                          "ami-d7450be7": "SuSE Linux Enterprise Server 12 (HVM)"
                        },
                        {
                          "ami-3d50120d": "Ubuntu Server 14.04 LTS (HVM)"
                        },
                        {
                          "ami-21f0bc11": "Microsoft Windows Server 2012 R2 Base"
                        }
                      ]
                    }
                  ],
                  "optional": [
                    {
                      "name": "BlockDeviceMappings",
                      "type": "BlockDeviceMappings",
                      "description": "tooltip??"
                    },
                    {
                      "name": "NetworkInterfaces",
                      "type": "NetworkInterfaces",
                      "description": "A list of NetworkInterface embedded objects that describe the network interfaces to associate with this instance"
                    },
                    {
                      "name": "SecurityGroupIds",
                      "type": "StringList",
                      "description": "A list that contains the security group IDs for VPC security groups to assign to the Amazon EC2 instance. If you specified the NetworkInterfaces property, do not specify this property"
                    },
                    {
                      "name": "SecurityGroups",
                      "type": "StringList",
                      "description": "Valid only for Amazon EC2 security groups. A list that contains the Amazon EC2 security groups to assign to the Amazon EC2 instance. The list can contain both the name of existing Amazon EC2 security groups or references to AWS::EC2::SecurityGroup resources created in the template"
                    },
                    {
                      "name": "Tags",
                      "type": "Tags",
                      "description": "tooltip??"
                    },
                    {
                      "name": "Volumes",
                      "type": "Volumes",
                      "description": "tooltip??"
                    },
                    {
                      "name": "AvailabilityZone",
                      "type": "String",
                      "description": "Specifies the name of the Availability Zone in which the instance is located",
                      "allowableValues": [
                        {
                          "ap-northeast-1b": "Asia Pacific (Tokyo)"
                        },
                        {
                          "ap-southeast-1b": "Asia Pacific (Singapore)"
                        },
                        {
                          "ap-southeast-2b": "Asia Pacific (Sydney)"
                        },
                        {
                          "eu-central-1b": "EU (Frankfurt)"
                        },
                        {
                          "eu-west-1b": "EU (Ireland)"
                        },
                        {
                          "sa-east-1b": "South America (Sao Paulo)"
                        },
                        {
                          "us-east-1b": "US East (N. Virginia)"
                        },
                        {
                          "us-west-1b": "US West (N. California)"
                        },
                        {
                          "us-west-2b": "US West (Oregon)"
                        }
                      ]
                    },
                    {
                      "name": "InstanceType",
                      "type": "String",
                      "description": "Description for tooltip",
                      "allowableValues": [
                        {
                          "t2.micro": "t2.micro"
                        },
                        {
                          "t2.small": "t2.small"
                        },
                        {
                          "t2.medium": "t2.medium"
                        },
                        {
                          "m3.medium": "m3.medium"
                        },
                        {
                          "m3.large": "m3.large"
                        },
                        {
                          "m3.xlarge": "m3.xlarge"
                        },
                        {
                          "m3.2xlarge": "m3.2xlarge"
                        },
                        {
                          "c3.large": "c3.large"
                        },
                        {
                          "c3.xlarge": "c3.xlarge"
                        },
                        {
                          "c3.2xlarge": "c3.2xlarge"
                        },
                        {
                          "c3.4xlarge": "c3.4xlarge"
                        },
                        {
                          "c3.8xlarge": " c3.8xlarge"
                        },
                        {
                          "r3.large": "r3.large"
                        },
                        {
                          "r3.xlarge": "r3.xlarge"
                        },
                        {
                          "r3.2xlarge": "r3.2xlarge"
                        },
                        {
                          "r3.4xlarge": "r3.4xlarge"
                        },
                        {
                          "r3.8xlarge": "r3.8xlarge"
                        },
                        {
                          "i2.xlarge": "i2.xlarge"
                        },
                        {
                          "i2.2xlarge": "i2.2xlarge"
                        },
                        {
                          "i2.4xlarge": "i2.4xlarge"
                        },
                        {
                          "i2.8xlarge": "i2.8xlarge"
                        },
                        {
                          "hs1.8xlarge": "hs1.8xlarge"
                        },
                        {
                          "g2.2xlarge": "g2.2xlarge"
                        }
                      ]
                    },
                    {
                      "name": "KeyName",
                      "type": "String",
                      "description": "Description for tooltip"
                    },
                    {
                      "name": "EbsOptimized",
                      "type": "Boolean",
                      "description": "Description for tooltip"
                    },
                    {
                      "name": "IamInstanceProfile",
                      "type": "String",
                      "description": "Description for tooltip"
                    },
                    {
                      "name": "DisableApiTermination",
                      "type": "Boolean",
                      "description": "Description for tooltip"
                    },
                    {
                      "name": "KernelId",
                      "type": "String",
                      "description": "Description for tooltip"
                    },
                    {
                      "name": "Monitoring",
                      "type": "Boolean",
                      "description": "Description for tooltip"
                    },
                    {
                      "name": "InstanceInitiatedShutdownBehavior",
                      "type": "String",
                      "description": "Description for tooltip"
                    },
                    {
                      "name": "PlacementGroupName",
                      "type": "String",
                      "description": "Description for tooltip"
                    },
                    {
                      "name": "PrivateIpAddress",
                      "type": "String",
                      "description": "Description for tooltip"
                    },
                    {
                      "name": "RamdiskId",
                      "type": "String",
                      "description": "Description for tooltip"
                    },
                    {
                      "name": "SourceDestCheck",
                      "type": "Boolean",
                      "description": "Description for tooltip"
                    },
                    {
                      "name": "SubnetId",
                      "type": "String",
                      "description": "Description for tooltip"
                    },
                    {
                      "name": "Tenancy",
                      "type": "String",
                      "description": "Description for tooltip",
                      "allowableValues": [
                        {
                          "default": "default"
                        },
                        {
                          "dedicated": "dedicated"
                        }
                      ]
                    },
                    {
                      "name": "UserData",
                      "type": "String",
                      "description": "Description for tooltip"
                    }
                  ],
                  "parent": "",
                  "blockType": "box"
                },
                "ELB4": {
                  "id": "ELB4",
                  "type": "AWS::ElasticLoadBalancing::LoadBalancer",
                  "name": "ELB4",
                  "description": "Automatically distributes incoming application traffic across multiple EC2 instances",
                  "image": "images/aws/elb.png",
                  "x": 365,
                  "y": 93,
                  "optional": [
                    {
                      "name": "AccessLoggingPolicy",
                      "type": "AccessLoggingPolicy",
                      "description": "Captures detailed information for all requests made to your load balancer, such as the time a request was received, client’s IP address, latencies, request path, and server responses."
                    },
                    {
                      "name": "AvailabilityZones",
                      "type": "AvailabilityZones",
                      "description": "The Availability Zones in which to create the load balancer. You can specify either AvailabilityZones or Subnets, but not both."
                    }
                  ],
                  "parent": "",
                  "blockType": "box"
                },
                "BlockDeviceMappings5": {
                  "id": "BlockDeviceMappings5",
                  "type": "BlockDeviceMappings",
                  "name": "BlockDeviceMappings5",
                  "image": "images/aws/blockDeviceMapping.png",
                  "x": 72,
                  "y": 565,
                  "required": [
                    {
                      "name": "AvailabilityZone",
                      "type": "String",
                      "description": "",
                      "allowableValues": [
                        {
                          "ap-northeast-1": "Asia Pacific (Tokyo)"
                        },
                        {
                          "ap-southeast-1": "Asia Pacific (Singapore)"
                        },
                        {
                          "ap-southeast-2": "Asia Pacific (Sydney)"
                        },
                        {
                          "eu-central-1": "EU (Frankfurt)"
                        },
                        {
                          "eu-west-1": "EU (Ireland)"
                        },
                        {
                          "sa-east-1": "South America (Sao Paulo)"
                        },
                        {
                          "us-east-1": "US East (N. Virginia)"
                        },
                        {
                          "us-west-1": "US West (N. California)"
                        },
                        {
                          "us-west-2": "US West (Oregon)"
                        }
                      ]
                    }
                  ],
                  "optional": [
                    {
                      "name": "Encrypted",
                      "type": "Boolean",
                      "description": ""
                    },
                    {
                      "name": "Iops",
                      "type": "Number",
                      "description": ""
                    },
                    {
                      "name": "Size",
                      "type": "String",
                      "description": ""
                    },
                    {
                      "name": "SnapshotId",
                      "type": "String",
                      "description": ""
                    },
                    {
                      "name": "Tags",
                      "type": "Tags",
                      "description": "An arbitrary set of tags (key–value pairs) for this volume."
                    },
                    {
                      "name": "VolumeType",
                      "type": "String",
                      "description": ""
                    }
                  ],
                  "parent": "EC21",
                  "isDerived": true,
                  "blockType": "drag",
                  "index": 0
                },
                "BlockDeviceMappings6": {
                  "id": "BlockDeviceMappings6",
                  "type": "BlockDeviceMappings",
                  "name": "BlockDeviceMappings6",
                  "image": "images/aws/blockDeviceMapping.png",
                  "x": 331,
                  "y": 569,
                  "required": [
                    {
                      "name": "AvailabilityZone",
                      "type": "String",
                      "description": "",
                      "allowableValues": [
                        {
                          "ap-northeast-1": "Asia Pacific (Tokyo)"
                        },
                        {
                          "ap-southeast-1": "Asia Pacific (Singapore)"
                        },
                        {
                          "ap-southeast-2": "Asia Pacific (Sydney)"
                        },
                        {
                          "eu-central-1": "EU (Frankfurt)"
                        },
                        {
                          "eu-west-1": "EU (Ireland)"
                        },
                        {
                          "sa-east-1": "South America (Sao Paulo)"
                        },
                        {
                          "us-east-1": "US East (N. Virginia)"
                        },
                        {
                          "us-west-1": "US West (N. California)"
                        },
                        {
                          "us-west-2": "US West (Oregon)"
                        }
                      ]
                    }
                  ],
                  "optional": [
                    {
                      "name": "Encrypted",
                      "type": "Boolean",
                      "description": ""
                    },
                    {
                      "name": "Iops",
                      "type": "Number",
                      "description": ""
                    },
                    {
                      "name": "Size",
                      "type": "String",
                      "description": ""
                    },
                    {
                      "name": "SnapshotId",
                      "type": "String",
                      "description": ""
                    },
                    {
                      "name": "Tags",
                      "type": "Tags",
                      "description": "An arbitrary set of tags (key–value pairs) for this volume."
                    },
                    {
                      "name": "VolumeType",
                      "type": "String",
                      "description": ""
                    }
                  ],
                  "parent": "EC22",
                  "isDerived": true,
                  "blockType": "drag",
                  "index": 0
                },
                "BlockDeviceMappings7": {
                  "id": "BlockDeviceMappings7",
                  "type": "BlockDeviceMappings",
                  "name": "BlockDeviceMappings7",
                  "image": "images/aws/blockDeviceMapping.png",
                  "x": 553,
                  "y": 570,
                  "required": [
                    {
                      "name": "AvailabilityZone",
                      "type": "String",
                      "description": "",
                      "allowableValues": [
                        {
                          "ap-northeast-1": "Asia Pacific (Tokyo)"
                        },
                        {
                          "ap-southeast-1": "Asia Pacific (Singapore)"
                        },
                        {
                          "ap-southeast-2": "Asia Pacific (Sydney)"
                        },
                        {
                          "eu-central-1": "EU (Frankfurt)"
                        },
                        {
                          "eu-west-1": "EU (Ireland)"
                        },
                        {
                          "sa-east-1": "South America (Sao Paulo)"
                        },
                        {
                          "us-east-1": "US East (N. Virginia)"
                        },
                        {
                          "us-west-1": "US West (N. California)"
                        },
                        {
                          "us-west-2": "US West (Oregon)"
                        }
                      ]
                    }
                  ],
                  "optional": [
                    {
                      "name": "Encrypted",
                      "type": "Boolean",
                      "description": ""
                    },
                    {
                      "name": "Iops",
                      "type": "Number",
                      "description": ""
                    },
                    {
                      "name": "Size",
                      "type": "String",
                      "description": ""
                    },
                    {
                      "name": "SnapshotId",
                      "type": "String",
                      "description": ""
                    },
                    {
                      "name": "Tags",
                      "type": "Tags",
                      "description": "An arbitrary set of tags (key–value pairs) for this volume."
                    },
                    {
                      "name": "VolumeType",
                      "type": "String",
                      "description": ""
                    }
                  ],
                  "parent": "EC23",
                  "isDerived": true,
                  "blockType": "drag",
                  "index": 0
                }
              };
            CFTemplate.setTemplate({
              "AWSTemplateFormatVersion": "2010-09-09",
              "Description": "Created By pdestal",
              "Parameters": {},
              "Mappings": {},
              "Conditions": {},
              "Resources": {
                "EC21": {
                  "Type": "AWS::EC2::Instance",
                  "Properties": {
                    "BlockDeviceMappings": [
                      {}
                    ]
                  }
                },
                "EC22": {
                  "Type": "AWS::EC2::Instance",
                  "Properties": {
                    "BlockDeviceMappings": [
                      {}
                    ]
                  }
                },
                "EC23": {
                  "Type": "AWS::EC2::Instance",
                  "Properties": {
                    "BlockDeviceMappings": [
                      {}
                    ]
                  }
                },
                "ELB4": {
                  "Type": "AWS::ElasticLoadBalancing::LoadBalancer",
                  "Properties": {}
                }
              },
              "Outputs": {
                "EC21ImageId": {
                  "Description": "Name of the EC2 instance",
                  "Value": {
                    "Ref": "EC21"
                  }
                },
                "EC22ImageId": {
                  "Description": "Name of the EC2 instance",
                  "Value": {
                    "Ref": "EC22"
                  }
                },
                "EC23ImageId": {
                  "Description": "Name of the EC2 instance",
                  "Value": {
                    "Ref": "EC23"
                  }
                }
              }
            });
            CanvasModel.connections = {
              "EC21": {
                "ELB4": "ELB4",
                "BlockDeviceMappings5": "BlockDeviceMappings5"
              },
              "EC22": {
                "ELB4": "ELB4",
                "BlockDeviceMappings6": "BlockDeviceMappings6"
              },
              "EC23": {
                "ELB4": "ELB4",
                "BlockDeviceMappings7": "BlockDeviceMappings7"
              }
            };

            _.each(CanvasModel.connections, function (targets, sourceName) {
              _.each(targets, function (targetName) {
                UIComponents.connectComponents(sourceName, targetName, false);
              });
            });


          }, function () {

          });
      };

      $scope.optimizePressed = function () {
        $modal.open({
          templateUrl: '../templates/modal_view_optimize.html',
          controller: '',
          size: 'lg'
        });
      };
      $scope.clickCallback = function (component) {
        itemSelected(component);
      };

      $scope.propertiesClicked = function (component) {

        //we should toggle it out
        if ($scope.showProperties && $scope.selectedComponent === component) {
          $scope.showTasks = false;
          $scope.showProperties = false;
          $scope.showComponents = false;
          if ($scope.isLeftOpen) {
            $scope.isLeftOpen = false;
            $rootScope.$broadcast('leftmostResizeRequest');
          }
        } else {
          $scope.showTasks = false;
          $scope.showProperties = true;
          $scope.showComponents = false;
          if (!$scope.isLeftOpen) {
            $scope.isLeftOpen = true;
            $rootScope.$broadcast('leftmostResizeRequest');
          }
        }

        $analytics.eventTrack('propertiesClicked', {componentName: component.name});

      };

      /* this function is available on the scope so the UI (i.e. html) can call
       to completely delete a component:
       1) remove all the connections from UI
       2) remove the component from the UI
       3) update model to remove the component's data and all the references to the deleted component
       4) update the final CloudFormation Template

       */
      $scope.deleteClicked = function (component) {

        if ($scope.selectedComponent === component) {
          delete $scope.selectedComponent;
          if ($scope.showProperties) {
            $scope.showProperties = false;
            $scope.closeLeft();
          }
        }

        // find the UI element
        var toBeDeletedElem = angular.element('[data-identifier =' + component.id + ']')[0];


        //these two plumb connection detachment will send a connectionDetached event that will actually cause the actual
        //json to get updated with removal of the connection

        // call "detach" on all the connections to/from this element to safely drop them (update the model)
        jsPlumb.detachAllConnections(toBeDeletedElem.id);

        //in case of a container we have to manually delete its connections and not count on the jsplumb event of
        //connection detached

        if (component.blockType === 'container') {
          _.each(CanvasModel.containments[component.name], function (targetName) {
              $scope.connectionDetached(component.name, targetName);
            }
          );
        }

        // now remove all the connections to/from this element on the UI
        jsPlumb.removeAllEndpoints(toBeDeletedElem.id);

        // remove the component's data from the list of all components
        delete CanvasModel.addedComponents[component.name];

        // update the Cloud Formation Tempalte
        CFTemplate.removeResource(component.name);


      };

      $scope.connectionEstablished = function (sourceName, targetName) {


        $analytics.eventTrack('connectionEstab', {source: sourceName, target: targetName});

        //Lazility instantiate the connections object
        if (!CanvasModel.connections[sourceName]) {
          CanvasModel.connections[sourceName] = {};
        }

        CanvasModel.connections[sourceName][targetName] = targetName;

        var sourceObject = CFTemplate.getResource(sourceName);
        var targetObject = CFTemplate.getResource(targetName);

        var incomingProperties = $scope.componentMetadata[targetObject.Type].IncomingConnection[sourceObject.Type];

        var result = CFTemplate.establishConnection(sourceName, sourceObject, targetName, targetObject, incomingProperties);
        $scope.$digest();
        return result;
      };

      $scope.containerPositionChanged = function (containerName, newPosition) {
        if (CanvasModel.addedComponents[containerName]) {

          CanvasModel.addedComponents[containerName].x = newPosition.left;
          CanvasModel.addedComponents[containerName].y = newPosition.top;
        }
      };


      $scope.itemPositionChanged = function (itemName, newPosition) {

        if (CanvasModel.addedComponents[itemName]) {

          CanvasModel.addedComponents[itemName].x = newPosition.left;
          CanvasModel.addedComponents[itemName].y = newPosition.top;
        }
      };
      //This function gets called when it has already been validated that
      //the droped item is legit for the container
      $scope.itemGotDroppedInsideContainer = function (itemName, containerName) {

        $analytics.eventTrack('dropInContainer', {item: itemName, container: containerName});

        var sourceObject = CFTemplate.getResource(itemName);
        var targetObject = CFTemplate.getResource(containerName);

        var incomingProperties = $scope.componentMetadata[targetObject.Type].IncomingConnection[sourceObject.Type];

        var result = CFTemplate.establishConnection(itemName, sourceObject, containerName, targetObject, incomingProperties);

        //add the bookkeeping containment DS
        //lazy initialize
        if (!CanvasModel.containments[containerName]) {
          CanvasModel.containments[containerName] = [];
        }

        //again because of the jquery ui library an item that is inside
        //a container can be moved within it. When that happens,there could be
        //two events fired for this method (I couldn't find a way to prevent this
        //inside the jquery UI so its here ) . don't add a new containment if
        //anything exists. + LessonLearned : Each piece of code should not expect
        //the other piece of code that interacts with an unknown library to
        //behave a certain way. I literally spent 2 hours on this bug.
        if (CanvasModel.containments[containerName].indexOf(itemName) === -1) {
          CanvasModel.containments[containerName].push(itemName);
        }

        $scope.$digest();

        return result;
      };

      $scope.itemGotDroppedOutsideContainer = function (itemName, containerName) {

        $analytics.eventTrack('dropOutContainer', {item: itemName, container: containerName});

        //first remove it from the container DS here
        if (CanvasModel.containments[containerName]) {
          var index = CanvasModel.containments[containerName].indexOf(itemName);
          if (index !== -1) {
            CanvasModel.containments[containerName].splice(index, 1);
          }
        }

        //now remove it from template
        $scope.connectionDetached(itemName, containerName);

      };


      $scope.containerDragged = function (containerName, offset) {

        $analytics.eventTrack('containerDragged', {container: containerName});

        if (CanvasModel.containments[containerName]) {
          _.each(CanvasModel.containments[containerName], function (insideItem) {
            if (CanvasModel.addedComponents[insideItem]) {
              CanvasModel.addedComponents[insideItem].x += offset.dx;
              CanvasModel.addedComponents[insideItem].y += offset.dy;
              //recursively move everything within that insideItem
              if (CanvasModel.addedComponents[insideItem].blockType === 'container') {
                $scope.containerDragged(insideItem, offset);
              }
            }
          });
        }

        $scope.$digest();

      };


      var deleteConnections = function (sourceObject, targetObject, sourceName, targetName, incomingProperties) {

        var finalTarget;

        // If this connection needs to update Target
        if (incomingProperties.isProperty === 'true') {
          finalTarget = targetObject.Properties;
        }
        else {
          finalTarget = targetObject;
        }

        ConnectionUtils.deleteBinding(incomingProperties.targetPropName, incomingProperties.targetPropValue,
          incomingProperties.targetPropValueMethod, incomingProperties.targetPolicy,
          finalTarget, sourceObject, sourceName);


        // If this connection needs to update Source
        if (incomingProperties.isProperty === 'true') {
          finalTarget = sourceObject.Properties;
        }
        else {
          finalTarget = sourceObject;
        }

        ConnectionUtils.deleteBinding(incomingProperties.sourcePropName, incomingProperties.sourcePropValue,
          incomingProperties.sourcePropValueMethod, incomingProperties.sourcePolicy,
          finalTarget, targetObject, targetName);
      };

      $scope.connectionDetached = function (sourceName, targetName) {

        $analytics.eventTrack('connectionDetached', {source: sourceName, target: targetName});

        var sourceObject = CFTemplate.getResource(sourceName);
        var targetObject = CFTemplate.getResource(targetName);

        var incomingProperties = $scope.componentMetadata[targetObject.Type].IncomingConnection[sourceObject.Type];

        //based on the preferences the incoming properties can be declared both in the source object or
        //target object. Instead of applying a rule that the writer needs to remember we just apply it
        //here
        if (incomingProperties) {
          deleteConnections(sourceObject, targetObject, sourceName, targetName, incomingProperties);
        }

        incomingProperties = $scope.componentMetadata[sourceObject.Type].IncomingConnection[targetObject.Type];
        if (incomingProperties) {
          deleteConnections(sourceObject, targetObject, sourceName, targetName, incomingProperties);
        }


        $scope.$digest();

      };

      $scope.connectionMovedFromSource = function (/*originalSourceName, newSourceName, targetName*/) {
        //in this case we need to change the name of the property on the target to
        //the new source
      };

      $scope.connectionMovedFromTarget = function (sourceName, originalTargetName) {
        //in ths case we need to remove the connection from target
        $scope.connectionDetached(sourceName, originalTargetName);
      };

      $scope.propertyDidDrag = function (data, event) {
        $analytics.eventTrack('complexPropDrag', {dragPropName: data.name});


        var leftPanelWidth = angular.element('#left-panel')[0].clientWidth;

        var uniqueId = generateComponentName(data.name);

        var c = new UIComponents.Component(
          uniqueId,
          data.name,
          uniqueId,
          data.image,
          $scope.types.complex[data.name].types.required,
          $scope.types.complex[data.name].types.optional,
          data.description,
            event.x - leftPanelWidth,
          event.y,
          data.parent
        );


        //determines whether the component is standalone or derived
        c.isDerived = true;
        c.blockType = data.blockType;

        CanvasModel.addedComponents[c.name] = c;

        c.index = CFTemplate.addComplexPropertyToResource(data.name, data.parent);

        // connect this complex property to its parent on the UI
        UIComponents.connectComponents(data.parent, c.name, true);

        //select this complex property on the UI
        itemSelected(c);
      };

      $scope.templateStringChanged = function () {
        try {
          CanvasModel.addedComponents = {};
          CanvasModel.connections = {};
          CFTemplate.setTemplate(JSON.parse($scope.templateString));
        } catch (err) {
          console.log(err);
        }

        var allResources = CFTemplate.getAllResources();

        //add any component that is in the json string but not in the addedComponents
        _.each(allResources, function (item) {
          if (!CanvasModel.addedComponents[item.name]) {
            var found = false;
            _.each(AWSComponents.components, function (component) {
              if (component.type === item.type) {

                found = true;
                var blueprint = component;
                var uniqueId = _.uniqueId(blueprint.name + '-');
                var c = new UIComponents.Component(
                  uniqueId,
                  blueprint.name,
                  item.name,
                  blueprint.image,
                  $scope.componentMetadata[blueprint.type].properties.required,
                  $scope.componentMetadata[blueprint.type].properties.optional,
                  blueprint.description,
                  100,
                  100);

                c.blockType = blueprint.blockType;
                itemSelected(c);

                CanvasModel.addedComponents[c.name] = c;
              }
            });
          }
        });

      };

      $scope.download = function () {
        $window.open('data:text/text;charset=utf-8,' + encodeURIComponent(
            'FAFAcomponents:' + angular.toJson($scope.canvasModel.addedComponents, true) +
            'FAFAtemplate:' + angular.toJson($scope.privateTemplate, true) +
            'FAFAconnections:' + angular.toJson($scope.canvasModel.connections, true)
        ));


      };

      //-----------------------------------------------------
      // Synchrnoization between editor json and object model
      //-----------------------------------------------------
      $scope.$watch(
        function () {
          return CFTemplate.getStringFormat();
        },
        function (newValue) {
          //TODO Farzad, I think there is a bug here. What if the
          //string is not a valid json ? This will mess up the whole thing
          //we should capture the exception and eat it ?
          $scope.templateString = newValue;
        }, true);


      //======================== Text Editor stuff
      var editor;
      $scope.aceEditorLoaded = function (_editor) {
        editor = _editor;
      };

      function selectElementInEditor(elementName) {
        window.setTimeout(function () {
          //get some of the regex magic going on to detect the correct part
          var regex = '"' + elementName + '"(\\s)*:(\\s)*';
          editor.find(regex, {regExp: true}, true);
          //editor.addSelectionMarker(range);
          editor.focus();
          editor.setHighlightGutterLine(true);
          editor.centerSelection();
        }, 100);
      }

    }]);
