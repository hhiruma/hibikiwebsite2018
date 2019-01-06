export default {
  pageSettings: {
      name: 'pageSettings',
      type: 'firestore',
      whichPath: 'collection',
      path: 'Settings/Pages/MainContentPages',
      options: {
          order: {
              field: 'order',
              direction: 'asc'
          }
      }
  },
  aboutUsContents: {
    name: 'pageContents',
    type: 'firestore',
    whichPath: 'collection',
    path: 'Contents/AboutUs/Descriptions',
    callback: (function (outputObj) {
      for (let el of outputObj['pageContents']){
        el['carouselState'] = 0
      }
      return outputObj
    }),
    options: {
      order: {
        field: 'order',
        direction: 'asc'
      }
    }
  },
  stageDetails: {
    name: 'stagesDetails',
    type: 'firestore',
    whichPath: 'field',
    path: 'Contents/Stages',
    fields: ['stagesMenuDescription']
  },
  nextStageDetail: {
    name: 'nextStageDetail',
    type: 'firestore',
    whichPath: 'doc',
    path: 'Contents/Stages/Other/NextStage'
  },
  stagesContents: {
    name: 'pageContents',
    type: 'firestore',
    whichPath: 'collection',
    path: 'Contents/Stages/Posts',
    fields: [],
    callback: (function (outputObj) {
      outputObj.yearGroups = Array.from(new Set(outputObj.pageContents.map(el => el.yearGroup)))
      return outputObj
    }),
    options: {
      order: {
        field: 'stageDate',
        direction: 'desc'
      }
    }
  },
  masterUserId: {
    name: 'masterUserId',
    type: 'firestore',
    whichPath: 'field',
    path: 'Settings/Users',
    fields: ['masterUserId']
  },
  newComersSettings: {
    name: 'newComersSettings',
    type: 'firestore',
    whichPath: 'doc',
    path: 'Contents/NewComers'
  },
  bgUrl: {
    name: 'bgUrl',
    type: 'firestore',
    whichPath: 'doc',
    path: 'Contents/Main/background/image_paths'
  },
  otherImagePaths: {
    name: 'otherImagePaths',
    type: 'firestore',
    whichPath: 'doc',
    path: 'Contents/otherImagePaths'
  },
  contactBg: {
    name: 'contactBg',
    type: 'firestore',
    whichPath: 'field',
    path: 'Contents/Contact',
    fields: ['bgUrl']
  }
}
