window.onload = () =>
{
    'use strict';

    if ('serviceWorker' in navigator)
    {
      navigator.serviceWorker
               .register('./service_worker.js');
    }
    onPageLoad();
  }