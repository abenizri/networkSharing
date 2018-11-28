const UserAction = require('../lib/user_action')
var userAction = new UserAction()

function initialize() {
  return new Promise(async resolve => {
    return resolve(await userAction.initialize())
  });
}
initialize();

exports.show = async (ctx) => {
    let domain = ctx.params.domain
    ctx.body = await userAction.getClicksPerDomain({domain})
    ctx.set('Access-Control-Allow-Origin', '*');
    ctx.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    ctx.set('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
    // await userAction.addUser({ ip, status: 'active' })
    // log.info(await userAction.getUser("109.186.238.61"));

    //ctx.body = 'done'
};

exports.update = async (ctx) => {
    let datetime = new Date()
    let date = datetime.toISOString().slice(0,10)
    const {
      domain,
      userId,
      eventType,
      selector,
      elementInfo,
      url,
    } = ctx.request.body
    await userAction.incrementClicks({ domain, userId, eventType ,selector, elementInfo, url, date })
    ctx.body = {
      status: 'success'
    }
    ctx.set('Access-Control-Allow-Origin', '*');
    ctx.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    ctx.set('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
};
