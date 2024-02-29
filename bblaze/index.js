window.addEventListener('DOMContentLoaded', () => {
    const videoElement = document.getElementById('videoPlayer');
    const bucketName = 'signBucket';
    const fileName = '00338.mp4';

    //const url = `https://f001.backblazeb2.com/file/${bucketName}/${fileName}`;

    fetch("https://f005.backblazeb2.com/file/signTalkv1/00433.mp4", { mode: 'no-cors' })
        .then(response => response.blob())
        .then(blob => {
            const videoURL = URL.createObjectURL(blob);
            videoElement.src = videoURL;
        })
        .catch(error => {
            console.error('Error fetching video:', error);
        });
});
