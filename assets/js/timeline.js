document.addEventListener('DOMContentLoaded', function() {
  // Timeline scroll pop-up effect with stagger and bounce
  function revealTimelineEvents() {
    const events = document.querySelectorAll('.timeline-event');
    const trigger = window.innerHeight * 0.85;
    let delay = 0;
    let closestIdx = -1;
    let closestDist = Infinity;
    const windowMiddle = window.innerHeight / 2;
    events.forEach((event, i) => {
      const rect = event.getBoundingClientRect();
      if (rect.top < trigger && !event.classList.contains('active')) {
        setTimeout(() => event.classList.add('active'), delay);
        delay += 180;
      }
      // Find the event closest to the center, but if at the bottom, force last box to light up
      const eventMiddle = rect.top + rect.height / 2;
      const dist = Math.abs(eventMiddle - windowMiddle);
      if (dist < closestDist) {
        closestDist = dist;
        closestIdx = i;
      }
    });
    // If scrolled to bottom, always light up the last event
    if ((window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 2)) {
      closestIdx = events.length - 1;
    }
    // If scrolled to top, always light up the first event
    if (window.scrollY === 0) {
      closestIdx = 0;
    }
    // Remove all in-view, then add to the closest
    events.forEach((event, i) => {
      if (i === closestIdx) {
        event.classList.add('in-view');
      } else {
        event.classList.remove('in-view');
      }
    });
  }
  window.addEventListener('scroll', revealTimelineEvents);
  revealTimelineEvents();
});
