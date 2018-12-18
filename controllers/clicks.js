const ClicksHendler = require('../lib/clicks_handler')
const SettingsHendler = require('../lib/settings_handler')
const FeedbacksHendler = require('../lib/feedbacks_handler')
const moment = require('moment')
const clicksHendler = new ClicksHendler()
const settingsHendler = new SettingsHendler()
const feedbacksHendler = new FeedbacksHendler()

function initialize() {

  new Promise(async resolve => {
    return resolve(await clicksHendler.initialize())
  });
  //
  new Promise(async resolve => {
    return resolve(await settingsHendler.initialize())
  });

  new Promise(async resolve => {
    return resolve(await feedbacksHendler.initialize())
  });
}

initialize();

function _normailzePage(page) {
  let str = page.replace('/', '').replace('.html','')
  if (str === '') str = 'home'
  return str
}

exports.submitFeeddback = async (ctx) => {
  let datetime = new Date()
  let date = datetime.toISOString().slice(0,10)
  const {
    domain,
    userId,
    selector,
    dataUri,
    page,
    feedbackRate,
    feedbackText
  } = ctx.request.body
  await feedbacksHendler.insert({domain, userId, selector,dataUri, page: _normailzePage(page), feedbackRate, feedbackText , date})
  ctx.body = {
    status: 'success'
  }
  ctx.status = 200
  ctx.set('Access-Control-Allow-Origin', '*');
  ctx.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  ctx.set('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
}

exports.getFeedbackPerDomain = async (ctx) => {
  let domain = ctx.params.domain
  ctx.set('Access-Control-Allow-Origin', '*');
  ctx.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  ctx.set('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');

  ctx.status = 200
  let feedbackRaw =  await feedbacksHendler.getAggSelectorAndPagePerDomain({domain})
  let output = []
  for (let elem of feedbackRaw) {
      let obj = {
        selector: elem.selector,
        dataUri: elem.dataUri,
        page: elem.page,
        elementId: elem.result[0].elementId,
        featureName: elem.result[0].featureName,
        feedbackRate:  elem.feedbackRate,
        feedbackText:  elem.feedbackText,
        status: elem.result[0].status
      }
      output.push(obj)
  }
  ctx.body = output
}

exports.getFeedback = async (ctx) => {

  try {
    let output = []
    let feedbackElement = await settingsHendler.getDailyFeedbackSelector({domain: ctx.params.domain, page: _normailzePage(ctx.query.page)})
    for (let selector of feedbackElement) {

    var startDate = new Date(selector.durationStart);
    var endDate = new Date(selector.durationEnd);
    var myDate = new Date()
    if (startDate <= myDate && myDate <= endDate) {
        output.push(selector)
    }
    ctx.body = output

    ctx.status = 200
  }
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
      dataUri
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
        dataUri,
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
