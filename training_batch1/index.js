const mainPath = '../signlanguagevideodataset/';
const jsonFileURL = mainPath + 'WLASL_v0.3.json';
const videoElement = document.getElementsByClassName('input_video')[0];
const canvasElement = document.getElementsByClassName('output_canvas')[0];
const canvasCtx = canvasElement.getContext('2d');

//checking for indexed DB
const indexedDB =
  window.indexedDB ||
  window.mozIndexedDB ||
  window.webkitIndexedDB ||
  window.msIndexedDB ||
  window.shimIndexedDB;

if (!indexedDB) {
  console.log("IndexedDB could not be found in this browser.");
}


// //creating schema
// const request = indexedDB.open("signlanguage", 1);

// request.onerror = function (event) {
//     console.error("An error occurred with IndexedDB");
//     console.error(event);
//   };


//   request.onupgradeneeded = function () {
//     //1
//     const db = request.result;
  
//     //2
//     const store = db.createObjectStore("sogn", { keyPath: "id" });
  
//     //3
//     store.createIndex("cars_colour", ["colour"], { unique: false });
  
//     // 4
//     store.createIndex("colour_and_make", ["colour", "make"], {
//       unique: false,
//     }); 
//   };





let array=[];
 let start=10,end=11;
 videoElement.autoplay = true;
  videoElement.loop = true;
  videoElement.muted = true;




  //training loop
  async function todosloop (){
    for (const elements of temp[0]){
      console.log(`${elements[0]}.mp4 `)
      videoElement.src = `videos/${elements[0]}.mp4`;
      await todos(elements[1]);
    }; 
  }
 //traing code
 function todos(classes){
  // videoElement.autoplay = true;
  // videoElement.loop = true;
  // videoElement.muted = true;
  console.log("in todos");
  function onResults(results) {
    array.push(results);
    console.log(array.length)
    
    // canvasCtx.save();
    // canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    // canvasCtx.drawImage(results.segmentationMask, 0, 0,
    //                     canvasElement.width, canvasElement.height);

    // // Only overwrite existing pixels.
    // //canvasCtx.globalCompositeOperation = 'source-in';
    // //canvasCtx.fillStyle = '#00FF00';
    // canvasCtx.fillRect(0, 0, canvasElement.width, canvasElement.height);

    // // Only overwrite missing pixels.
    // canvasCtx.globalCompositeOperation = 'destination-atop';
    // canvasCtx.drawImage(
    //     results.image, 0, 0, canvasElement.width, canvasElement.height);

    // canvasCtx.globalCompositeOperation = 'source-over';
    // drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS,
    //               {color: '#00FF00', lineWidth: 4});
    // drawLandmarks(canvasCtx, results.poseLandmarks,
    //               {color: '#FF0000', lineWidth: 2});
    // drawConnectors(canvasCtx, results.faceLandmarks, FACEMESH_TESSELATION,
    //               {color: '#C0C0C070', lineWidth: 1});
    // drawConnectors(canvasCtx, results.leftHandLandmarks, HAND_CONNECTIONS,
    //               {color: '#CC0000', lineWidth: 5});
    // drawLandmarks(canvasCtx, results.leftHandLandmarks,
    //               {color: '#00FF00', lineWidth: 2});
    // drawConnectors(canvasCtx, results.rightHandLandmarks, HAND_CONNECTIONS,
    //               {color: '#00CC00', lineWidth: 5});
    // drawLandmarks(canvasCtx, results.rightHandLandmarks,
    //               {color: '#FF0000', lineWidth: 2});
    // canvasCtx.restore();
  }
  
  //creating instance
  const holistic = new Holistic({locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`;
  }});
  //seting options
  holistic.setOptions({
    modelComplexity: 1,
    smoothLandmarks: true,
    enableSegmentation: true,
    smoothSegmentation: true,
    refineFaceLandmarks: true,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5
  });
  holistic.onResults(onResults);


  //video settings
  

  //processing available data
  async function done() {
    let arrays =JSON.parse(localStorage.getItem(classes));
    
     
    console.log("Inside done function");
    //post array
    for (const elements of arrays) {
      await new Promise(resolve => {
        canvasCtx.save();
        canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
        //canvasCtx.drawImage(array[0].segmentationMask, 0, 0, canvasElement.width, canvasElement.height);

        // Only overwrite existing pixels.
        //canvasCtx.globalCompositeOperation = 'source-in';
        // canvasCtx.fillStyle = '#00FF00';
        canvasCtx.fillRect(0, 0, canvasElement.width, canvasElement.height);

        // Only overwrite missing pixels.
        canvasCtx.globalCompositeOperation = 'destination-atop';
        //canvasCtx.drawImage(array[0].image, 0, 0, canvasElement.width, canvasElement.height);

        canvasCtx.globalCompositeOperation = 'source-over';
        drawConnectors(canvasCtx, elements.poseLandmarks, POSE_CONNECTIONS, { color: '#00FF00', lineWidth: 4 });
        drawLandmarks(canvasCtx, elements.poseLandmarks, { color: '#FF0000', lineWidth: 2 });
        drawConnectors(canvasCtx, elements.faceLandmarks, FACEMESH_TESSELATION, { color: '#C0C0C070', lineWidth: 1 });
        drawConnectors(canvasCtx, elements.leftHandLandmarks, HAND_CONNECTIONS, { color: '#CC0000', lineWidth: 5 });
        drawLandmarks(canvasCtx, elements.leftHandLandmarks, { color: '#00FF00', lineWidth: 2 });
        drawConnectors(canvasCtx, elements.rightHandLandmarks, HAND_CONNECTIONS, { color: '#00CC00', lineWidth: 5 });
        drawLandmarks(canvasCtx, elements.rightHandLandmarks, { color: '#FF0000', lineWidth: 2 });
        canvasCtx.restore();

        // Wait for the canvas changes to complete
        setTimeout(resolve, 250); // Adjust the delay if needed
      });
    }

    console.log('Canvas changes completed.');
  }

  // Define the event handler function
  const timeUpdateHandler = async () => {
    if (array.length !== 15) {
      await holistic.send({ image: videoElement });
    } else {
      // Remove the event listener
      videoElement.removeEventListener('timeupdate', timeUpdateHandler);

      // Store the array elements in localStorage to pass them to the next page
      localStorage.setItem(classes, JSON.stringify(array));
      console.log("posted")

      // Navigate to the next.html page
      await done();
    }
  };

  // Add the event listener
  videoElement.addEventListener('timeupdate', timeUpdateHandler);

 }













 //extraction code

function getVideoIds(jsonList) {
    const videosList = [];
    
  
    function checkVideoExistence(ins, i) {
      return new Promise(resolve => {
        const videoId = ins.instances[i].video_id;
        const videoPath = mainPath + 'videos/' + videoId + '.mp4';
        
        const videoElement = document.createElement('video');
        
        // Add an event listener to check if the video can be loaded
        videoElement.addEventListener('loadedmetadata', () => {
          console.log(ins.gloss);
          resolve([videoId,ins.gloss]);
        });
      
        // Add an event listener to check if the video cannot be loaded
        videoElement.addEventListener('error', () => {
          const nextIndex = i + 1;
          if (nextIndex < ins.instances.length) {
            resolve(checkVideoExistence(ins, nextIndex));
          } else {
            resolve(null);
          }
        });
      
        videoElement.src = videoPath;
      });
    }
   
    for(let i=start;i<end;i++){
      const initialIndex = 0;
      videosList.push(checkVideoExistence(jsonList[i], initialIndex));
      
      // if(i === (end-1)) {
      //   localStorage.setItem('batch1', JSON.stringify(videosList));
      //   console.log("posted");
      //   console.log(videosList[0]);
      // }
    }
    
    
    

    // Use Promise.all to wait for all promises to resolve
    return Promise.all(videosList).then(results => {
      // Filter out null values (videos that don't exist)
      return results.filter(videoId => videoId !== null);
    });
  }
let it=start;
 let temp=[]; 
// Fetch the JSON file
fetch(jsonFileURL)
  .then(response => response.json())
  .then(jsonList => {
    // Call the function and handle the result
    getVideoIds(jsonList)
      .then(videoIds => {
        
        temp.push(videoIds);
        //console.log(temp)
        //console.log(videoIds);
        localStorage.setItem('batch1', JSON.stringify(temp));
        console.log("posted");
        todosloop();
        
      })
      .catch(error => {
        console.error('Error:', error);
      });
  })
  .catch(error => {
    console.error('Error fetching JSON file:', error);
  });


// localStorage.setItem('batch1', JSON.stringify(temp));