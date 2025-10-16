// jQuery Document Ready
$(document).ready(function() {
    
    // Initialize all functions
    initTheme();
    initNavbarScroll();
    initSmoothScroll();
    initTypingEffect();
    initContactForm(); // ← MAKE SURE THIS IS CALLED!
    initScrollAnimations();
    initWeatherApp();
    
    // Theme Toggle Functionality
    function initTheme() {
        const themeToggle = $('#themeToggle');
        const themeIcon = themeToggle.find('i');
        
        // Check for saved theme or prefer-color-scheme
        const savedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        // Set initial theme
        if (savedTheme) {
            $('body').attr('data-theme', savedTheme);
        } else if (systemPrefersDark) {
            $('body').attr('data-theme', 'dark');
        } else {
            $('body').attr('data-theme', 'light');
        }
        
        // Update icon based on current theme
        updateThemeIcon();
        
        // Theme toggle click event
        themeToggle.on('click', function() {
            const currentTheme = $('body').attr('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            $('body').attr('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon();
        });
        
        function updateThemeIcon() {
            const currentTheme = $('body').attr('data-theme');
            if (currentTheme === 'dark') {
                themeIcon.removeClass('fa-moon').addClass('fa-sun');
            } else {
                themeIcon.removeClass('fa-sun').addClass('fa-moon');
            }
        }
    }
    
    // Navbar scroll effect
    function initNavbarScroll() {
        $(window).scroll(function() {
            if ($(this).scrollTop() > 100) {
                $('.custom-navbar').addClass('scrolled');
            } else {
                $('.custom-navbar').removeClass('scrolled');
            }
        });
    }
    
    // Smooth scrolling for navigation links
    function initSmoothScroll() {
        $('a[href^="#"]').on('click', function(e) {
            e.preventDefault();
            const target = $(this.getAttribute('href'));
            if (target.length) {
                $('html, body').animate({
                    scrollTop: target.offset().top - 80
                }, 800);
            }
        });
    }
    
    // Typing effect for hero section
    function initTypingEffect() {
        const typingText = $('#typing-text');
        const typingName = $('#typing-name');
        const text = "Hi, I'm ";
        const name = "Hirwa Gad";
        
        let i = 0;
        let j = 0;
        
        function typeText() {
            if (i < text.length) {
                typingText.append(text.charAt(i));
                i++;
                setTimeout(typeText, 100);
            } else {
                // Add cursor after first part
                typingText.append('<span class="typing-cursor">|</span>');
                setTimeout(typeName, 500);
            }
        }
        
        function typeName() {
            if (j < name.length) {
                // Remove cursor from text and add to name
                typingText.find('.typing-cursor').remove();
                typingName.append(name.charAt(j));
                typingName.append('<span class="typing-cursor">|</span>');
                j++;
                setTimeout(typeName, 100);
            } else {
                // Final cursor blink and removal
                setTimeout(() => {
                    typingName.find('.typing-cursor').remove();
                }, 1000);
            }
        }
        
        // Start typing after a short delay
        setTimeout(typeText, 10);
    }
    
    // Formspree AJAX Contact Form
        function initContactForm() {
        $('#contactForm').on('submit', function(e) {
            e.preventDefault();

            const submitBtn = $('#submitBtn');
            const btnText = submitBtn.find('.btn-text');
            const btnLoading = submitBtn.find('.btn-loading');
            const formMessage = $('#formMessage');

            // Show loading state
            btnText.hide();
            btnLoading.show();
            submitBtn.prop('disabled', true);
            formMessage.html('').removeClass('alert-success alert-danger');

            // Get form data
            const formData = $(this).serialize();

            // Send to PHP
            $.ajax({
                url: 'index.php',
                type: 'POST',
                data: formData,
                dataType: 'json',
                success: function(response) {
                    if (response.success) {
                        formMessage.html(`
                            <div class="alert alert-success alert-dismissible fade show" role="alert">
                                ✅ ${response.message}
                                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                            </div>
                        `);
                        $('#contactForm')[0].reset();
                    } else {
                        formMessage.html(`
                            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                                ❌ ${response.message}
                                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                            </div>
                        `);
                    }
                },
                error: function() {
                    formMessage.html(`
                        <div class="alert alert-danger alert-dismissible fade show" role="alert">
                            ❌ Network error. Please try again.
                            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                        </div>
                    `);
                },
                complete: function() {
                    btnText.show();
                    btnLoading.hide();
                    submitBtn.prop('disabled', false);
                }
            });
        });
    }
    
    // Weather App Functionality
    function initWeatherApp() {
        $('#getWeather').on('click', function() {
            const city = $('#weatherCity').val().trim();
            const weatherResult = $('#weatherResult');
            
            if (!city) {
                weatherResult.html('<p class="text-danger">Please enter a city name</p>');
                return;
            }
            
            // Show loading
            weatherResult.html(`
                <div class="text-center">
                    <div class="spinner-border text-primary" role="status"></div>
                    <p class="mt-2">Loading weather data...</p>
                </div>
            `);
            
            const apiKey = "7fdef2ac499aea6fdbdcd485ec90aa94"; 
            const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
            
            $.ajax({
                url: apiUrl,
                method: 'GET',
                success: function(data) {
                    const weather = data.weather[0];
                    const main = data.main;
                    const temp = Math.round(main.temp);
                    const feelsLike = Math.round(main.feels_like);
                    const humidity = main.humidity;
                    const windSpeed = data.wind.speed;
                    
                    // Weather icon mapping
                    const iconMap = {
                        '01d': 'fa-sun',
                        '01n': 'fa-moon',
                        '02d': 'fa-cloud-sun',
                        '02n': 'fa-cloud-moon',
                        '03d': 'fa-cloud',
                        '03n': 'fa-cloud',
                        '04d': 'fa-cloud',
                        '04n': 'fa-cloud',
                        '09d': 'fa-cloud-rain',
                        '09n': 'fa-cloud-rain',
                        '10d': 'fa-cloud-sun-rain',
                        '10n': 'fa-cloud-moon-rain',
                        '11d': 'fa-bolt',
                        '11n': 'fa-bolt',
                        '13d': 'fa-snowflake',
                        '13n': 'fa-snowflake',
                        '50d': 'fa-smog',
                        '50n': 'fa-smog'
                    };
                    
                    const weatherIcon = iconMap[weather.icon] || 'fa-cloud';
                    
                    weatherResult.html(`
                        <div class="weather-result">
                            <h4>Weather in ${data.name}, ${data.sys.country}</h4>
                            <div class="d-flex align-items-center justify-content-center my-3">
                                <i class="fas ${weatherIcon} fa-3x text-primary me-3"></i>
                                <div>
                                    <h2 class="mb-0">${temp}°C</h2>
                                    <p class="mb-0 text-capitalize">${weather.description}</p>
                                </div>
                            </div>
                            <div class="row text-center">
                                <div class="col-4">
                                    <small>Feels like</small>
                                    <p class="mb-0 fw-bold">${feelsLike}°C</p>
                                </div>
                                <div class="col-4">
                                    <small>Humidity</small>
                                    <p class="mb-0 fw-bold">${humidity}%</p>
                                </div>
                                <div class="col-4">
                                    <small>Wind</small>
                                    <p class="mb-0 fw-bold">${windSpeed} m/s</p>
                                </div>
                            </div>
                        </div>
                    `);
                },
                error: function(xhr, status, error) {
                    if (xhr.status === 401) {
                        weatherResult.html(`
                            <div class="alert alert-info">
                                <h5>API Demo</h5>
                                <p>This demo shows how API integration works. To make it functional:</p>
                                <ol class="text-start">
                                    <li>Sign up at <a href="https://openweathermap.org/api" target="_blank">OpenWeatherMap</a></li>
                                    <li>Get your free API key</li>
                                    <li>Replace 'demo' with your actual API key in the code</li>
                                </ol>
                                <p class="mb-0"><strong>Demo Data:</strong> London - 15°C, Partly Cloudy</p>
                            </div>
                        `);
                    } else {
                        weatherResult.html('<p class="text-danger">City not found. Please try again.</p>');
                    }
                }
            });
        });
        
        // Allow Enter key to trigger weather search
        $('#weatherCity').on('keypress', function(e) {
            if (e.which === 13) {
                $('#getWeather').click();
            }
        });
    }
    
    // Scroll animations for elements
    function initScrollAnimations() {
        const animateOnScroll = function() {
            $('.skill-card, .project-card, .about-content, .contact-form').each(function() {
                const element = $(this);
                const position = element.offset().top;
                const scrollPosition = $(window).scrollTop() + $(window).height() - 100;
                
                if (position < scrollPosition) {
                    element.css({
                        'opacity': '1',
                        'transform': 'translateY(0)'
                    });
                }
            });
        };
        
        // Set initial state
        $('.skill-card, .project-card, .about-content, .contact-form').css({
            'opacity': '0',
            'transform': 'translateY(30px)',
            'transition': 'opacity 0.6s ease, transform 0.6s ease'
        });
        
        // Animate on scroll
        $(window).on('scroll', animateOnScroll);
        // Trigger once on load
        animateOnScroll();
    }
    
    // Add hover effects to project cards with jQuery
    $('.project-card').hover(
        function() {
            $(this).css({
                'transform': 'translateY(-10px) scale(1.02)'
            });
        },
        function() {
            $(this).css({
                'transform': 'translateY(-5px) scale(1)'
            });
        }
    );
    
    // Global functions
    window.smoothScroll = function(target) {
        $('html, body').animate({
            scrollTop: $(target).offset().top - 80
        }, 800);
    };
    
    window.showWeatherDemo = function() {
        $('#weatherModal').modal('show');
    };
});

// Additional animation for skills cards on hover
$(document).on('mouseenter', '.skill-card', function() {
    $(this).find('.skill-icon').css('transform', 'scale(1.1) rotate(5deg)');
}).on('mouseleave', '.skill-card', function() {
    $(this).find('.skill-icon').css('transform', 'scale(1) rotate(0deg)');
});