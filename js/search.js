$(document).ready(function(){
    $("#search-button").click(function(){
        let name = $("#search").val();
        name = name.replace(/(<([^>]+)>)/ig,"");
        let data = {
            name: name,
            action : 'search',
        };
        let suggestions = $('#suggestions');
        suggestions.css({"border": "none"});
        suggestions.html('');

        $.ajax({
            type: "POST",
            url: "php/search.php",
            data: data,
            dataType: "json",
            success: function(response)
            {
                let results = $("#results");
                if (response.status === 0) {
                    results.html('<div id="error">' + response.message + '</div>');
                } else {
                    var formatter = new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD',
                    });
                    let jsonData = response.data;
                    let len = Object.keys(jsonData).length;
                    var foundationText = ' Foundations';
                    if (len === 1) {
                        foundationText = ' Foundation';
                    }
                    var text = '<h3>Results for "' + name + '" Search</h3><h4>' + len + foundationText + ' Found</h4><table><thead><th style="width:60%">Name</th><th style="width:40%">Amount Funded</th></thead>';

                    if (len === 0) {
                        text += '<tr><td colspan="3" style="text-align:center">No Funders found.</td></tr>'
                    } else {
                        for (var key in jsonData) {
                            var obj = jsonData[key];
                            var url = ''
                            text += '<tr><td>';
                            if (obj.url !== null) {
                                text += '<a href="' + obj.url + '" target=\"_blank\">' + obj.name + '</a>';
                            } else {
                                text += obj.name;
                            }
                            text += '</td><td>' + formatter.format(obj.amount) + '</td></tr>';
                        }
                    }

                    text += '</table>';
                    results.html(text);
                }
            },
            error: function(xhr, status, error) {
                var err = eval("(" + xhr.responseText + ")");
                results.html('<div id="error">' + err + '</div>');
            }
        });
    });

    $('#search').on('input', function() {
        let name = $(this).val();

        if (name.length < 3) {
            let suggestions = $("#suggestions");
            suggestions.css({"border": "none"});
            suggestions.html('');
        } else {
            let data = {
                name: name,
                action : 'suggestions',
            };
            let suggestions = $("#suggestions");

            $.ajax({
                type: "POST",
                url: "php/search.php",
                data: data,
                dataType: "json",
                success: function(response)
                {
                    let jsonData = response.data;
                    let len = jsonData.length;
                    var i;
                    var text = '';
                    if (len > 0) {
                        suggestions.css({"border": "1px solid grey"});
                    } else {
                        suggestions.css({"border": "none"});
                    }

                    for (i = 0; i < len; i++) {
                        text += '<div class="name">'+ jsonData[i] + '</div>';
                    }
                    suggestions.html(text);
                },
                error: function(xhr, status, error) {
                    let suggestions = $("#suggestions");
                    suggestions.css({"border": "none"});
                    suggestions.html('');
                }
            });
        }
    }).keyup(function (event) {
        var keycode = (event.keyCode ? event.keyCode : event.which);
        if (keycode == '13'){
            $("#search-button").click();
        }
    });

    $(document).on("mouseenter", ".name", function() {
        $('.name').removeClass('name-active');
        $(this).addClass('name-active');
    });

    $(document).on("click", ".name", function() {
        $('#search').val($(this).text());
        let suggestions = $('#suggestions');
        suggestions.css({"border": "none"});
        suggestions.html('');
    });

    $(document).on("mouseout mouseleave", ".name", function() {
        $('.name').removeClass('name-active');
    });

    $('#suggestions').css('cursor', 'pointer');

    $("#reset-button").click(function(){
        let suggestions = $('#suggestions');
        suggestions.css({"border": "none"});
        suggestions.html('');
        $("#results").html('');
        $("#search").val('');
    });
});
