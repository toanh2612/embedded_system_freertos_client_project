import _ from 'lodash';
import CONFIG from "../config";
import rabbitMQService from "../services/rabbitMQService";
export default (option,req, res, next) => {
  option = (typeof option ===  'object') ? option  : {};
  const method = req.method.toLowerCase();

  if (['put','delete'].indexOf(method) !== -1 ) {
    const httpRequest = {..._.pick(req,['method','query', 'body', 'originalUrl','headers'])};
    const queueData = {
      type:"coreApi",
      httpRequest
    };
    rabbitMQService.sender({queueName:'local_server',queueData,mode:'local'});

  }
  if (method === 'post' && option['result'] &&  option['result']['dataValues'] && option['result']['dataValues']['id'] ) {
    const httpRequest = {..._.pick(req,['method','query', 'body', 'originalUrl','headers'])};
    httpRequest['body']['id'] = option['result']['dataValues']['id'];
    console.log(httpRequest);
    const queueData = {
      type:"coreApi",
      httpRequest
    };
    rabbitMQService.sender({queueName:'local_server',queueData,mode:'local'});
  }

  return res.json({
    ...option
  })
}
