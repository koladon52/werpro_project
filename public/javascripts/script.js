//////////////////SCRIPT///////////////////////////

$(document).ready(function addJobfavourite()
{

    $(document).on('click' , '.favourite' , function(){
        
        const postid = $('.favourite').attr('data');
        console.log(postid);

        $.ajax({
            url : "/findjob/joblist/"+postid+"/addfavourite",
            method : "POST",
            success : function(){
                $('.favourite').removeClass('favourite').addClass('favourited');
                $('.far fa-heart').removeClass('fas fa-heart').addClass('far fa-heart');
                location.reload();
            }
        })
    })
})

$(document).ready(function removeJobfavourite()
    {
        $(document).on('click','.favourited',function(){
            const postid = $('.favourited').attr('data');
            console.log(postid);
    
            $.ajax({
                url : "/findjob/joblist/"+postid+"/removefavourite",
                method : "delete",
                success : function(){
                    $('.favourited').removeClass('favourited').addClass('favourite');
                    $('.fas fa-heart').removeClass('far fa-heart').addClass('fas fa-heart');
                    location.reload()
                }
            })
        })
    })

    $(document).ready(function showimage(){
        $(document).on('click',function(){
            
        })
    })

    
$(document).ready(function addResumefavourite()
{

    $(document).on('click' , '.favourite' , function(){
        
        const postid = $('.favourite').attr('data');
        console.log(postid);

        $.ajax({
            url : "/findworker/workerlist/"+postid+"/addfavourite",
            method : "POST",
            success : function(){
                $('.favourite').removeClass('favourite').addClass('favourited');
                $('.far fa-heart').removeClass('fas fa-heart').addClass('far fa-heart');
                location.reload();
            }
        })
    })
})

$(document).ready(function removeResumefavourite()
    {
        $(document).on('click','.favourited',function(){
            const postid = $('.favourited').attr('data');
            console.log(postid);
    
            $.ajax({
                url : "/findworker/workerist/"+postid+"/removefavourite",
                method : "delete",
                success : function(){
                    $('.favourited').removeClass('favourited').addClass('favourite');
                    $('.fas fa-heart').removeClass('far fa-heart').addClass('fas fa-heart');
                    location.reload()
                }
            })
        })
    })
    