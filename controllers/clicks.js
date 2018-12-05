const ClicksHendler = require('../lib/clicks_handler')
const SettingsHendler = require('../lib/settings_handler')
const moment = require('moment')
var clicksHendler = new ClicksHendler()
var settingsHendler = new SettingsHendler()

function initialize() {
  new Promise(async resolve => {
    return resolve(await clicksHendler.initialize())
  });

  new Promise(async resolve => {
    return resolve(await settingsHendler.initialize())
  });
}
initialize();

exports.getFeedback = async (ctx) => {

  try {
    let domain = ctx.params.domain
    ctx.body = [
      {
        selector: 'html>body>div:nth-child(1)>div:nth-child(5)>div:nth-child(2)>main>div>div>div:nth-child(2)>div>div:nth-child(1)',
        form: 'default',
        page: '*/index'
      },
      {
        selector: 'html>body>div:nth-child(1)>div:nth-child(5)>div:nth-child(2)>main>div>div>div:nth-child(2)>div>div:nth-child(3)',
        form: 'default',
        page: '*/email'
      }

    ]
    ctx.status = 200
  } catch (error) {
    ctx.status = 500
    ctx.body = []
  } finally {
    ctx.set('Access-Control-Allow-Origin', '*');
    ctx.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    ctx.set('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
  }
};

exports.show = async (ctx) => {
    let domain = ctx.params.domain
    let configData = await settingsHendler.findSelector({domain})
    let selectorAndPagePerDomain = await settingsHendler.getAggSelectorAndPagePerDomain({domain})
    if (configData.length > 0) {
      ctx.body = await clicksHendler.getClicksPerDomain({domain}, configData, selectorAndPagePerDomain)
      ctx.set('Access-Control-Allow-Origin', '*');
      ctx.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
      ctx.set('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');

      ctx.status = 200
    } else {
      ctx.status = 500
    }
};

exports.save = async (ctx) => {
    await settingsHendler.saveTable(ctx.request.body.data)
    ctx.body = {
      status: 'success'
    }
    ctx.status = 200
    ctx.set('Access-Control-Allow-Origin', '*');
    ctx.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    ctx.set('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
};

exports.update = async (ctx) => {
    let datetime = new Date()
    let date = datetime.toISOString().slice(0,10)
    let {
      domain,
      userId,
      eventType,
      selector,
      elementInfo,
      page,
    } = ctx.request.body

    page = page.replace('/', '').replace('.html','')
    if (page === '') page = 'home'


    if (!selector) {
      ctx.state = 500
      return ctx.body ={
        error: 'selector is null'
      }
    }
    let find = await clicksHendler.findSelector({ domain, userId, eventType ,selector, page })
    if (find.length === 0) {
      let name = await clicksHendler.getElementObjectId(elementInfo)
      if (!name) {
        ctx.state = 500
        return ctx.body ={
          error: 'product info is insufficient'
        }
      }

      let data = {
        selector,
        domain,
        page,
        elementId: name,
        featureName: name,
        usage: 'high',
        enableCampaign: 'no',
        recipients: 'all',
        feedbackForm: 'default',
        durationStart: null,
        durationEnd: null,
        status: 'pending'
      }
      await settingsHendler.insert(data)
    }

    await clicksHendler.incrementClicks({ domain, userId, eventType ,selector, elementInfo, page, date })
    ctx.body = {
      status: 'success'
    }
    ctx.set('Access-Control-Allow-Origin', '*');
    ctx.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    ctx.set('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
    ctx.status = 200
};
