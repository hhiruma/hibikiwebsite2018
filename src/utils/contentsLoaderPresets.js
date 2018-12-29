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
  newComersContents: {
    name: 'newComersContents',
    type: 'firestore',
    whichPath: 'doc',
    path: 'Contents/NewComers'
  }
}
