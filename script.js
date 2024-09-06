document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded and parsed');

    var ctaButton = document.getElementById('ctaButton');
    var burgerMenu = document.getElementById('burgerMenu');
    var menu = document.getElementById('menu');

    gsap.registerPlugin(ScrollTrigger);

        // Create the timeline
        let tl = gsap.timeline({
            scrollTrigger: {
                trigger: ".hero",
                start: "top top",
                end: "+=7000px",
                scrub: true,
                pin: ".hero",
                anticipatePin: 1
            }
        });

        // Sequentially animate additional texts to ensure each appears and disappears before the next
        tl.from("#heroText", { opacity: 0, y: 50, duration: 30, delay: 30 }) // Hero Text appears
        .from("#additionalText1", { opacity: 0, y: 50, duration: 30, delay: 30 }) // Text 1 appears
        .to("#additionalText1", { opacity: 0, y: -50, duration: 10, delay: 30 }) // Text 1 disappears
        .from("#additionalText2", { opacity: 0, y: 50, duration: 30 }) // Text 2 appears after Text 1 disappears
        .from("#additionalText3", { opacity: 0, y: 50, duration: 30 }) // Text 3 appears
        .to("#additionalText3", { opacity: 0, y: -50, duration: 10, delay: 30 }) // Text 3 disappears
        .from("#additionalText4", { opacity: 0, y: 50, duration: 30 }) // Text 4 appears
        .to("#additionalText4", { opacity: 0, y: -50, duration: 10, delay: 30 }) // Text 4 disappears
        .to("#additionalText2", { opacity: 0, y: -50, duration: 10 }) // Text 2 disappears
        .to("#heroText", { opacity: 0, y: -50, duration: 10 }) // heroText disappears
        .from("#additionalText5", { opacity: 0, y: 50, duration: 30 }) // Text 5 appears
        .to("#additionalText5", { opacity: 0, y: -50, duration: 10, delay: 30 }) // Text 5 disappears
        .from("#additionalText6", { opacity: 0, y: 50, duration: 30 }) // Text 6 appears
        .from("#additionalText7", { opacity: 0, y: 50, duration: 30 }) // Text 7 appears
        .to("#additionalText6", { opacity: 0, y: -50, duration: 10, delay: 30 }) // Text 6 disappears
        .to("#additionalText7", { opacity: 0, y: -50, duration: 10 }) // Text 7 disappears

    
        //Add DB-Logo to timeline
        .from("#db-logo", { opacity: 0, y: 50, duration: 30 }) // Logo appears

        //Add cta-Button to timeline
        .to("#ctaButton", { display: 'block', opacity: 1, y: 0, duration: 30, delay: 30 }); // CTA button appears at the end


    // Burger menu toggle
    burgerMenu.addEventListener('click', function() {
        menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
    });

    // Smooth scrolling for internal menu links only
    document.querySelectorAll('.menu a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            // Check if the link is an internal link (starts with #)
            if (href.startsWith('#')) {
                e.preventDefault(); // Prevent the default link behavior
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                window.scrollTo({
                    top: targetElement.offsetTop,
                    behavior: 'smooth'
                });
                menu.style.display = 'none'; // Hide the menu after clicking an internal link
            }
            // For external links, do not prevent the default behavior
        });
    });

    // Smooth scrolling for CTA button
    ctaButton.addEventListener('click', function() {
        const targetElement = document.getElementById('audit-section');
        window.scrollTo({
            top: targetElement.offsetTop,
            behavior: 'smooth'
        });
    });

    // Slider functionality for the audit section
    let currentSlide = 0;
    let answers = {};
    let score = 0;

    function nextSlide(slideNumber) {
        const currentSlide = document.getElementById(`slide${slideNumber}`);
        const options = currentSlide.querySelectorAll('input[type="radio"]');
        let selectedOption = null;
        options.forEach(option => {
            if (option.checked) {
                selectedOption = option;
            }
        });

        if (!selectedOption) {
            alert("Bitte wählen Sie zuerst eine Option aus.");
            return;
        }

        answers[`question${slideNumber}`] = selectedOption.value;
        score += parseInt(selectedOption.getAttribute('data-score'), 10);

        if (slideNumber < 4) {
            currentSlide.style.display = 'none';
            document.getElementById(`slide${slideNumber + 1}`).style.display = 'block';
        } else {
            // Reached the final slide
            displayResults();
            hideAuditMessage(); // Hide the message when showing slide 5
        }
    }

    function prevSlide(slideNumber) {
        // Get the current slide and the previous slide elements
        const currentSlide = document.getElementById(`slide${slideNumber}`);
        const previousSlide = document.getElementById(`slide${slideNumber - 1}`);
    
        // Ensure we don't go before the first slide
        if (slideNumber > 1) {
            // Hide the current slide
            currentSlide.style.display = 'none';
    
            // Show the previous slide
            previousSlide.style.display = 'block';
        }
    }

    // Make prevSlide available globally
    window.prevSlide = prevSlide;
    
    function hideAuditMessage() {
        // Find the audit section paragraph and hide it
        const auditMessage = document.querySelector('.audit-section p');
        if (auditMessage) {
            auditMessage.style.display = 'none'; // Hide the paragraph when reaching the final slide
        }
    }

    function displayResults() {
        // Hide the "Kurz-Audit" title
        document.getElementById('audit-title').style.display = 'none';
    
        // Display the answers in the summary cards
        document.getElementById('answer1').innerHTML = `<p>${answers.question1}</p>`;
        document.getElementById('answer2').innerHTML = `<p>${answers.question2}</p>`;
        document.getElementById('answer3').innerHTML = `<p>${answers.question3}</p>`;
        document.getElementById('answer4').innerHTML = `<p>${answers.question4}</p>`;
    
        // Display the score
        document.getElementById('score').innerText = score;
    
        // Hide slide 4 and show slide 5
        document.getElementById('slide4').style.display = 'none';
        document.getElementById('slide5').style.display = 'block';
    
        // Hide all CTA buttons initially
        document.getElementById('cta1').style.display = 'none';
        document.getElementById('cta2').style.display = 'none';
        document.getElementById('cta3').style.display = 'none';
    
        // Show the appropriate CTA button based on the score
        if (score < 7) {
            document.getElementById('cta1').style.display = 'block';
        } else if (score >= 7 && score < 12) {
            document.getElementById('cta2').style.display = 'block';
        } else {
            document.getElementById('cta3').style.display = 'block';
        }
    
        // Add the "Unsere Empfehlung" title dynamically to the left column
        const leftColumn = document.querySelector('#slide5 .col-md-6');
        leftColumn.innerHTML = '<h3>Unsere Empfehlung</h3>' + leftColumn.innerHTML;
    }
    

    // Initial display setup
    document.getElementById('slide1').style.display = 'block';

    // Make nextSlide function available globally
    window.nextSlide = nextSlide;

    document.getElementById('email-link').addEventListener('click', function (event) {
        event.preventDefault();
        var email = 'yourname' + '@' + 'domain.com';
        var subject = 'Bitte%20um%20Kennlerngespräch';
        this.href = 'mailto:' + email + '?subject=' + subject;
        window.location.href = this.href;
      });
    
});
