document.addEventListener('drop', function(event) {
    let song = event.dataTransfer.getData('text');


    console.log('Dropped song:', song);


  });
  