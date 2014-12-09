/**
 * Created by Fathalian on 12/8/14.
 */
var app = angular.module('nestorApp.services');

app.service('EC2Pricings', function () {

  this.prices = {
    'ap-northeast-1b': {},
    'ap-southeast-1b' : {},
    'ap-southeast-2b' : {},
    'eu-central-1b' :{},
    'eu-west-1b' : {},
    'sa-east-1b': {},
    'us-east-1b': {
      't2.micro' : 0.013 * 730,
      't2.small' : 0.026 * 730,
      't2.medium' : 0.052 * 730,
      'm3.medium' : 0.070 * 730,
      'm3.large' : 0.140 * 730,
      'm3.xlarge' : 0.280 * 730,
      'm3.2xlarge' : 0.560 * 730
    },
    'us-west-1b': {
      't2.micro' : 0.017 * 730,
      't2.small' : 0.034 * 730,
      't2.medium' : 0.068 * 730,
      'm3.medium' : 0.077 * 730,
      'm3.large' : 0.154 * 730,
      'm3.xlarge' : 0.308 * 730,
      'm3.2xlarge' : 0.616 * 730
    },
    'us-west-2b': {}
  }
});
