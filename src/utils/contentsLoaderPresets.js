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
  masterUserId: {
    name: 'masterUserId',
    type: 'firestore',
    whichPath: 'field',
    path: 'Settings/Users',
    fields: ['masterUserId']
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
      // Sort the page contents in order of stage date
      outputObj.pageContents.sort((a, b) => {
        const dateA = new Date(a.stageDate.year, a.stageDate.month, a.stageDate.day)
        const dateB = new Date(b.stageDate.year, b.stageDate.month, b.stageDate.day)
        if (dateA > dateB) return -1
        if (dateA < dateB) return 1
        else return 0
      })

      // Add array of available year groups
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



  newComersSettings: {
    name: 'newComersSettings',
    type: 'firestore',
    whichPath: 'doc',
    path: 'Contents/NewComers'
  },
  //newComersContent: {},
  //newComresMedia: {},



  contactBg: {
    name: 'contactBg',
    type: 'firestore',
    whichPath: 'field',
    path: 'Contents/Contact',
    fields: ['bgUrl']
  }
}
