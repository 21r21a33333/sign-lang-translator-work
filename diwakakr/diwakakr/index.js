const videoElement = document.getElementsByClassName('input_video')[0];
        const canvasElement = document.getElementsByClassName('output_canvas')[0];
        const canvasCtx = canvasElement.getContext('2d');
        let array=[];

        //canvas rendering
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
        videoElement.autoplay = true;
        videoElement.loop = true;
        videoElement.muted = true;

        //processing available data
        async function done() {
          let arrays =JSON.parse(localStorage.getItem('hungry'));
          
           
          console.log("Inside done function");
          //post array
          for (const elements of arrays) {
            await new Promise(resolve => {
              canvasCtx.save();
              canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
              canvasCtx.drawImage(array[0].segmentationMask, 0, 0, canvasElement.width, canvasElement.height);

              // Only overwrite existing pixels.
              //canvasCtx.globalCompositeOperation = 'source-in';
              // canvasCtx.fillStyle = '#00FF00';
              canvasCtx.fillRect(0, 0, canvasElement.width, canvasElement.height);

              // Only overwrite missing pixels.
              canvasCtx.globalCompositeOperation = 'destination-atop';
              canvasCtx.drawImage(array[0].image, 0, 0, canvasElement.width, canvasElement.height);

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
          if (array.length !== 10) {
            await holistic.send({ image: videoElement });
          } else {
            // Remove the event listener
            videoElement.removeEventListener('timeupdate', timeUpdateHandler);

            // Store the array elements in localStorage to pass them to the next page
            localStorage.setItem('hungry', JSON.stringify(array));
            console.log("posted")

            // Navigate to the next.html page
            done();
          }
        };

        // Add the event listener
        videoElement.addEventListener('timeupdate', timeUpdateHandler);



