//getelement queries
const canvasElement = document.getElementsByClassName('output_canvas')[0];
const canvasCtx = canvasElement.getContext('2d');
var subtitles = document.getElementById('subtitles');

console.log("hello");

let text;

//DATABASE
const indexedDB =
  window.indexedDB ||
  window.mozIndexedDB ||
  window.webkitIndexedDB ||
  window.msIndexedDB ||
  window.shimIndexedDB;

if (!indexedDB) {
  console.log("IndexedDB could not be found in this browser.");
}
const request = indexedDB.open("signlanguages", 1);
request.onerror = function (event) {
    console.error("An error occurred with IndexedDB");
    console.error(event);
};
 async function getdb(parameter){
    const db = request.result;
    const transaction = db.transaction("Signs", "readwrite");
    const store = transaction.objectStore("Signs");
    const accessIndex = store.index("access_frames");
    const idQuery = store.get(parameter);
    idQuery.onsuccess = async function () {
        //console.log( idQuery.result.ins);
        if(idQuery.result !=null )
        await done(idQuery.result.ins,idQuery.result.gloss);  
        else{
          let callthem=parameter.split("");
          for(let calls in callthem){
          if(callthem[calls]=="")continue;
          subtitles.textContent = callthem[calls];
          subtitles.style.visibility = 'visible';
          subtitles.style.textAlign = 'center';
          subtitles.style.backgroundColor = 'red';
          
          subtitles.style.textEmphasisColor = 'red';

          console.log(callthem[calls]);
          await getdb(`${callthem[calls]}__`); 
          //const indQuery=store.get(callthem[calls]);
          //console.log(indQuery.result.ins,indQuery.result.gloss);
          //await done(indQuery.result.ins,indQuery.result.gloss);
          subtitles.style.visibility = 'hidden';
        }
  
        }
      };
        return new Promise((res)=>{
          setTimeout(()=>{
         res();} , 3000);});
}



//inputdata
function getTextFromTextarea() {
    console.log("clicked");
    // Select the textarea element by its id
    var textarea = document.getElementById("to_be_changed");
    
    // Retrieve the value of the textarea
     text = textarea.value;
    
    // Perform actions with the retrieved text input
    console.log("Text input:", text);
    // ... do something with the text input
    // div.textContent="";
    start_sign();
}

// Event listener for the button click
var button = document.getElementById("your_button_id");
button.addEventListener("click", getTextFromTextarea);


async function start_sign(){
  let texts=text.toLowerCase();
    const myArray = texts.split(" ");
    for(let arr in myArray){
      if(myArray[arr]==""  )continue;
        subtitles.textContent = myArray[arr];
        subtitles.style.visibility = 'visible';
        subtitles.style.textAlign = 'center';
        subtitles.style.textEmphasisColor = 'red';
        console.log(myArray[arr]);
       await getdb(myArray[arr]);
       subtitles.style.visibility = 'hidden';
    }
    
}


        
        
//processing available data
async function done(temp,name) {
     //let arrays =JSON.parse(localStorage.getItem('hello'));
            console.log("Inside done function");
            console.log(temp);


            
           
            //post array
            for (const elements of temp) {
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
                drawConnectors(canvasCtx, elements.poseLandmarks, POSE_CONNECTIONS, { color: '#00FF00', lineWidth: 0.3 });
                //drawLandmarks(canvasCtx, elements.poseLandmarks, { color: '#FF0000', lineWidth: 2 });
                drawConnectors(canvasCtx, elements.faceLandmarks, FACEMESH_TESSELATION, { color: '#C0C0C070', lineWidth: 0.5 });
                drawConnectors(canvasCtx, elements.leftHandLandmarks, HAND_CONNECTIONS, { color: '#CC0000', lineWidth: 10 });
                drawLandmarks(canvasCtx, elements.leftHandLandmarks, { color: '#00FF00', lineWidth: 1 });
                drawConnectors(canvasCtx, elements.rightHandLandmarks, HAND_CONNECTIONS, { color: '#00CC00', lineWidth: 10 });
                drawLandmarks(canvasCtx, elements.rightHandLandmarks, { color: '#FF0000', lineWidth: 1 });
                canvasCtx.restore();
  
                // Wait for the canvas changes to complete
                setTimeout(resolve, 250); // Adjust the delay if needed

                
              });
            }

            
    
}




