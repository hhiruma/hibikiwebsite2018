import firestore from "@/firebase_firestore";

/*
 * Usage:
 *   available keys in target objects
 *      name:                key name of the element which will be outputted to 'output' in component
 *      type:                "firestore", "storage", null
 *      whichPath:           "collection", "doc", "field", null
 *      path:                path to reference in firebase related contents
 *      callback:            callback function to call after loaded content, takes outputObj as argument, return modified outputObj
 *      options:
 *         order:
 *            field:         specify field name to order
 *            direction:     'desc' or 'asc'
*/

export default {
    addLoadTarget(loader, targetParam){
        if (this.checkLoaderShape){
            loader.targetParams.push(targetParam)
            loader.isLoading = true
        }
    },
    async startLoading(loader){
        let tmpObj = {}
        if (this.checkLoaderShape){
            for(const targetParam of loader.targetParams){
                const loadedTarget = await this.loadTarget(targetParam)
                if (loadedTarget.length === 1) {
                    tmpObj[targetParam.name] = loadedTarget[0]
                } else {
                    tmpObj[targetParam.name] = loadedTarget
                }

                if ('callback' in targetParam) {
                    tmpObj = targetParam.callback(tmpObj)
                }
            }
        }

        loader.isLoading = false
        return tmpObj
    },
    async loadTarget(param){
        let responseArray = []
        if(param.type === 'firestore'){
            switch (param.whichPath){
                case 'collection':
                    let collectionRef = firestore.collection(param.path)
                    if ('options' in param){
                      if ('order' in param.options) {
                          collectionRef = collectionRef.orderBy(param.options.order.field, param.options.order.direction)
                      }
                    }
                    (await collectionRef.get()).forEach(doc => responseArray.push(doc.data()))
                    break

                case 'doc':
                    const docRef = firestore.doc(param.path)
                    responseArray.push((await docRef.get()).data())
                    break

                case 'field':
                    const docFieldRef = firestore.doc(param.path)
                    const data = (await docFieldRef.get()).data()
                    let tmp = {}
                    for (const field of param.fields) {
                        if (field in data){
                            responseArray.push(data[field])
                        } else {
                            console.error('Specified field does not exist.')
                        }
                    }
                    break

                default:
                    console.error('No other type of loader expected.')
            }
        } else if (param.type === 'storage'){
            console.error('No loading was expected from storage.')
        } else {
            console.error('Trying to load from unexpected location.')
        }

        console.log(responseArray)
        return responseArray
    },
    checkLoaderShape(loader){
        ["isLoading", "targetParams"].forEach(key => {
            if (!(key in loader)) {
                console.error('loader shape is not as expected')
                return false
            }
        })
        return true
    }
}
