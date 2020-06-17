//////////////////SCRIPT///////////////////////////

$(document).ready(function addfavourite()
{

    $(document).on('click' , '.favourite' , function(){
        
        const postid = $('.favourite').attr('data');
        console.log(postid);

        $.ajax({
            url : "/joblist/"+postid+"/addfavourite",
            method : "POST",
            success : function(){
                $('.favourite').removeClass('favourite').addClass('favourited');
                $('.far fa-heart').removeClass('fas fa-heart').addClass('far fa-heart');
                // $('#text-addfavourite').text("บันทึกแล้ว");
            }

        })
    })
})

$(document).ready(function removefavourite()
    {
        $(document).on('click','.favourited',function(){
            const postid = $('.favourited').attr('data');
            console.log(postid);
    
            $.ajax({
                url : "/joblist/"+postid+"/removefavourite",
                method : "delete",
                success : function(){
                    $('.favourited').removeClass('favourited').addClass('favourite');
                    
                    $('.fas fa-heart').removeClass('far fa-heart').addClass('fas fa-heart');
                    // $('#text-addfavourite').text("เพิ่มในรายการโปรด");
                }
            })
        })
    })

    $(document).ready(function showimage(){
        $(document).on('click',function(){
            
        })
    })
    