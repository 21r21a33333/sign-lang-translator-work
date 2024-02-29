const mainPath = '../signlanguagevideodataset/';
const jsonFileURL = mainPath + 'WLASL_v0.3.json';
let start=1801,end=1999;
async function getVideoIds(jsonList) {
    const videosList = [];
    function checkVideoExistence(ins, i) {
      return new Promise(resolve => {
        console.log(ins);
        const videoId = ins.instances[i].video_id;
        const videoPath = mainPath + 'videos/' + videoId + '.mp4';
        
        const videoElement = document.createElement('video');
        
        // Add an event listener to check if the video can be loaded
        videoElement.addEventListener('loadedmetadata', () => {
          resolve(videoId);
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
      console.log(i);
      const initialIndex = 0;
      
       videosList.push(`"${jsonList[i].gloss}" : "${await checkVideoExistence(jsonList[i], initialIndex)}"`);
      
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
        console.log(temp)
        console.log(videoIds);
        // localStorage.setItem('batch1', JSON.stringify(temp));
        // console.log("posted");
        
      })
      .catch(error => {
        console.error('Error:', error);
      });
  })
  .catch(error => {
    console.error('Error fetching JSON file:', error);
  });


// localStorage.setItem('batch1', JSON.stringify(temp));