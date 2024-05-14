    document.addEventListener('DOMContentLoaded', function () { 
        const popupModal =  
            document.getElementById('popupModal'); 
        const closeModal =  
            document.getElementById('closeModal'); 
        const postContainer =  
            document.querySelector('.bookingDetailsContainer'); 

        myModal.addEventListener('click', function () { 
            popupModal.style.display = 'flex'; 
        }); 
      
        closeModal.addEventListener('click', function () { 
            popupModal.classList.add('fadeOut'); 
            setTimeout(() => { 
                popupModal.style.display = 'none'; 
                popupModal.classList.remove('fadeOut'); 
            }, 500); 
        }); 
    }); 