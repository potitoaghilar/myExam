
$(document).ready(async function () {

    // Show exam title
    $('#exam-title').text('"' + (await API.getExamTitle()) + '"');

    // Get "Avvia Esame" button
    const newSessionBtn = $('#newSession');

    // Start a new session when we click on "Avvia Esame"
    newSessionBtn.click(newSession);

    function newSession() {

        // Prepare environment with some visual effects
        $('.logo').removeClass('col-9').addClass('col-6');
        $('.exam-title').fadeOut();
        newSessionBtn.fadeOut();

        // Timer useful to wait the transitions triggered above
        setTimeout(function () {

            // Show the Loading spinner
            $('#loader').fadeIn();

            // Instantiate session
            const session = new Session();

            // Fetch the questions from external API
            session.fetchQuestions();

        }, 1000);

    }

});
