const express = require('express')
const { KubeConfig, CoreV1Api } = require('@kubernetes/client-node');


// k8s api config
const kubeConfig = new KubeConfig();
kubeConfig.loadFromDefault();
const k8sCoreApi = kubeConfig.makeApiClient(CoreV1Api);

// creating the express app
const app = express()

// setting up the template englin

app.set('view engine','ejs')



// listen for requests :

app.listen(3000);
app.use(express.static('public'))



// Function to parse plain text logs line by line
function parseLogs(logs) {
  // Split the logs by lines
  const lines = logs.split('\n');

  // Initialize an array to store parsed logs
  const parsedLogs = [];

  // Iterate over each log line
  lines.forEach(line => {
      // Add the line to the array of parsed logs
      parsedLogs.push(line);
  });

  return parsedLogs;
}




// Function to get the logs of a pod
async function getPodLogs(podName) {
  try {
    const logs = await k8sCoreApi.readNamespacedPodLog('nassim-deployment-7c6995ccc4-lp6lt', 'nassim-namespace');
    return logs;
  } catch (error) {
    console.error(`Error getting logs for pod ${podName}:`, error);
    return null;
  }
}




//handle urls 

app.get('/pods',async(req,res)=>{
  try {
      // list all pods 
      const response = await k8sCoreApi.listNamespacedPod('nassim-namespace');
      const pods      = response.body.items

      // assign the logs for each pod 
      for (const pod of pods) {
        const podName = pod.metadata.name;
        const logs = await getPodLogs(podName);
        pod.logs = parseLogs(logs.body); // Append logs to the pod object
      }
    
      res.render('pods',{pods:response.body.items})
    } catch (error) {
      console.error('Error listing pods:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
})