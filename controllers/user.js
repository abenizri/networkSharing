const UserAction = require('../lib/user_action')
var userAction = new UserAction()

function initialize() {
  return new Promise(async resolve => {
    return resolve(await userAction.initialize())
  });
}
initialize();

exports.show = async (ctx) => {
    let ip = ctx.params.ip
    await userAction.addUser({ ip, status: 'active' })
    // log.info(await userAction.getUser("109.186.238.61"));
    ctx.body = 'done'
};

exports.update = async (ctx) => {
    const {
      ip,
      status
    } = ctx.request.body
    let newStatus = (status) ? 'inactive' : 'active'
    await userAction.addUser({ ip, status: newStatus })
    // log.info(await userAction.getUser("109.186.238.61"));
    ctx.body = 'done'
};
