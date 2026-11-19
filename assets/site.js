const preview = document.querySelector('[data-preview]');
if (preview) {
  const tabs = [...preview.querySelectorAll('[data-mode]')];
  const eventButton = preview.querySelector('[data-preview-event]');
  let mode = 'stationary';
  let hasEvent = true;
  function update() {
    preview.classList.toggle('has-event', hasEvent);
    const evp = mode === 'evp';
    for (const tab of tabs) {
      const selected = tab.dataset.mode === mode;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
    }
    preview.querySelector('[role="tabpanel"]').setAttribute('aria-labelledby', `tab-${mode}`);
    preview.querySelector('[data-preview-label]').textContent = evp ? 'EVP · listening window' : 'Stationary session';
    preview.querySelector('[data-preview-title]').textContent = evp ? 'Ask. Then listen.' : 'Listening to the room.';
    preview.querySelector('[data-preview-clock]').textContent = evp ? '00:14' : '02:58';
    preview.querySelector('[data-preview-badge]').textContent = evp ? 'Question 1' : 'Baseline established';
    preview.querySelector('[data-sound-reading]').textContent = hasEvent ? '−37.4' : '−67.1';
    preview.querySelector('[data-event-label]').textContent = hasEvent ? 'Sound change' : 'Within baseline';
    eventButton.textContent = hasEvent ? 'Reset the preview' : 'Preview a sound change';
    preview.querySelector('[data-preview-status]').textContent = hasEvent ? 'A sound change, kept alongside the other readings.' : evp ? 'Each question gets its own listening window.' : 'Four readings. One shared timeline.';
  }
  for (const tab of tabs) {
    tab.addEventListener('click', () => { mode = tab.dataset.mode; hasEvent = false; update(); });
    tab.addEventListener('keydown', event => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const target = event.key === 'Home' ? tabs[0] : event.key === 'End' ? tabs.at(-1) : tabs.find(item => item !== tab);
      target.click(); target.focus();
    });
  }
  eventButton.addEventListener('click', () => { hasEvent = !hasEvent; update(); });
}
