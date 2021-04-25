window.onload = () =>
{
    'use strict';

    if ('serviceWorker' in navigator)
    {
      navigator.serviceWorker
               .register('./The Game/service_worker.js');
    }
    onPageLoad();
  }
