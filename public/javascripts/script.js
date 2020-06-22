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
                window.location.reload();
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
                    window.location.reload();
                }
            })
        })
    })
    
$(document).ready(function Resumefavourite()
{
    $(document).on('click' , '.fresume' , function(){
        const postid = $('.fresume').attr('data');
        console.log(postid);
        $.ajax({
            url : "/findworker/workerlist/"+postid+"/addfavourite",
            method : "POST",
            success : function(){
                $('.fresume').removeClass('fresume').addClass('fdresume');
                $('.far fa-heart').removeClass('fas fa-heart').addClass('far fa-heart');
                window.location.reload();
            }
        })
    })

    $(document).on('click','.fdresume',function(){
        const postid = $('.fdresume').attr('data');
        console.log(postid);
        $.ajax({
            url : "/findworker/workerist/"+postid+"/removefavourite",
            method : "delete",
            success : function(){
                $('.fdresume').removeClass('fdresume').addClass('fresume');
                $('.fas fa-heart').removeClass('far fa-heart').addClass('fas fa-heart');
                window.location.reload();
            }
        })
    })
})


    