$(function () {
  let current = 1;
  let animating = false;
  const total = $(".page").length;

  function updateCounter() {
    $("#currentPage").text(String(current).padStart(2, "0"));
  }

  // -----------------------------
  // PAGE TURNING
  // -----------------------------
  function turnTo(target) {
    if (animating || target < 1 || target > total || target === current) {
      return;
    }

    animating = true;

    const oldPage = $('.page[data-page="' + current + '"]');
    const newPage = $('.page[data-page="' + target + '"]');

    // Forward: turn the current page away
    if (target > current) {
      newPage.removeClass("turning prev").addClass("active");

      // Force browser to register the initial state
      void newPage[0].offsetWidth;

      oldPage.removeClass("active prev").addClass("turning");

      current = target;
      updateCounter();

      setTimeout(function () {
        oldPage.removeClass("turning").addClass("prev");
        animating = false;

        if (current === 4) {
          typeMessage();
        }
      }, 950);

    // Backward: bring previous page back
    } else {
      newPage.removeClass("prev turning").addClass("active");

      void newPage[0].offsetWidth;

      oldPage.removeClass("active").addClass("prev");

      current = target;
      updateCounter();

      setTimeout(function () {
        animating = false;

        if (current === 4) {
          typeMessage();
        }
      }, 950);
    }
  }

  // -----------------------------
  // NEXT BUTTON
  // -----------------------------
  $("[data-next]").on("click", function (e) {
    e.preventDefault();

    if (current < total && !animating) {
      turnTo(current + 1);
    }
  });

  // -----------------------------
  // KEYBOARD NAVIGATION
  // -----------------------------
  $(document).on("keydown", function (e) {
    if ($("#yesScreen").is(":visible") || animating) {
      return;
    }

    if (
      e.key === "ArrowRight" ||
      e.key === "Enter" ||
      e.key === " "
    ) {
      e.preventDefault();

      if (current < total) {
        turnTo(current + 1);
      }
    }

    if (e.key === "ArrowLeft") {
      e.preventDefault();

      if (current > 1) {
        turnTo(current - 1);
      }
    }
  });

  // -----------------------------
  // TOUCH / SWIPE NAVIGATION
  // -----------------------------
  let touchStartX = 0;
  let touchStartY = 0;

  $(document).on("touchstart", function (e) {
    if ($("#yesScreen").is(":visible")) return;

    const touch = e.originalEvent.touches[0];

    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
  });

  $(document).on("touchend", function (e) {
    if ($("#yesScreen").is(":visible") || animating) {
      return;
    }

    const touch = e.originalEvent.changedTouches[0];

    const diffX = touch.clientX - touchStartX;
    const diffY = touch.clientY - touchStartY;

    // Ignore mostly vertical gestures
    if (Math.abs(diffX) < 60 || Math.abs(diffX) < Math.abs(diffY)) {
      return;
    }

    // Ignore tiny movements
    if (Math.abs(diffX) < 60) {
      return;
    }

    if (diffX < 0 && current < total) {
      turnTo(current + 1);
    }

    if (diffX > 0 && current > 1) {
      turnTo(current - 1);
    }
  });

  // -----------------------------
  // TYPEWRITER CONFESSION
  // -----------------------------
  let typedDone = false;

  function typeMessage() {
    if (typedDone) return;

    typedDone = true;

    const text = "I think I like you, Richa.";
    let i = 0;

    $("#typed").text("");
    $(".after-type").removeClass("show");

    const timer = setInterval(function () {
      i++;
      $("#typed").text(text.substring(0, i));

      if (i >= text.length) {
        clearInterval(timer);

        setTimeout(function () {
          $(".after-type").addClass("show");
        }, 450);
      }
    }, 75);
  }

  // -----------------------------
  // FLOATING HEARTS
  // -----------------------------
  function makeHeart() {
    const heart = $('<span class="floating-heart">♥</span>');

    heart.css({
      left: Math.random() * 100 + "%",
      fontSize: 10 + Math.random() * 20 + "px",
      animationDuration: 7 + Math.random() * 8 + "s"
    });

    $(".hearts").append(heart);

    setTimeout(function () {
      heart.remove();
    }, 16000);
  }

  setInterval(makeHeart, 900);

  // -----------------------------
  // PLAYFUL NO BUTTON
  // -----------------------------
  const noButton = $("#noBtn");
  const hint = $("#hint");

  let dodgeCount = 0;

  function dodgeNoButton() {
    dodgeCount++;

    const area = $("#buttons");

    const areaWidth = area.innerWidth();
    const buttonWidth = noButton.outerWidth();

    const maxX = Math.max(
      100,
      areaWidth / 2 - buttonWidth
    );

    const maxY = 85;

    const randomX =
      Math.random() * maxX * 2 - maxX;

    const randomY =
      Math.random() * maxY * 2 - maxY;

    noButton.css({
      position: "absolute",
      left: "50%",
      top: "50%",
      transform:
        "translate(calc(-50% + " +
        randomX +
        "px), calc(-50% + " +
        randomY +
        "px))"
    });

    const messages = [
      "Hmm… try again 😌",
      "Nope, you can't catch me 🙈",
      "Are you sure about that? 👀",
      "The button says no, but the universe says… maybe? 😏",
      "Okay okay, I'm still running. 😂"
    ];

    hint.text(
      messages[
        Math.min(
          dodgeCount - 1,
          messages.length - 1
        )
      ]
    );
  }

  noButton.on(
    "mouseenter touchstart click",
    function (e) {
      e.preventDefault();
      dodgeNoButton();
    }
  );

  // -----------------------------
  // YES BUTTON / CELEBRATION
  // -----------------------------
  $("#yesBtn").on("click", function () {
    $("#yesScreen")
      .css("display", "flex")
      .hide()
      .fadeIn(600)
      .attr("aria-hidden", "false");

    for (let i = 0; i < 35; i++) {
      const heart = $('<span class="confetti-heart">♥</span>');

      heart.text(
        Math.random() > 0.35 ? "♥" : "✦"
      );

      const x =
        (Math.random() - 0.5) *
        window.innerWidth *
        1.15;

      const y =
        (Math.random() - 0.5) *
        window.innerHeight *
        1.15;

      heart.css({
        "--x": x + "px",
        "--y": y + "px",
        left: "50%",
        top: "50%"
      });

      $("#yesScreen").append(heart);

      setTimeout(function () {
        heart.remove();
      }, 1900);
    }
  });

  // -----------------------------
  // BACK FROM YES SCREEN
  // -----------------------------
  $("#backBtn").on("click", function () {
    $("#yesScreen").fadeOut(500, function () {
      $(this)
        .attr("aria-hidden", "true")
        .find(".confetti-heart")
        .remove();
    });
  });

  // Initial state
  $(".page").removeClass("active prev turning");
  $('.page[data-page="1"]').addClass("active");

  updateCounter();
});