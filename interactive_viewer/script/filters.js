(function () {
  'use strict';

  function closeAllFilterPanels(except) {
      document.querySelectorAll('.filter-dropdown.open').forEach(dropdown => {
          if (dropdown !== except) dropdown.classList.remove('open');
      });
  }

  function updateDropdownToggleState(dropdown, toggleBtn, domain, panel) {
      const checkboxes = panel.querySelectorAll('.kind-checkbox');
      const checkedCount = Array.from(checkboxes).filter(cb => cb.checked).length;
      dropdown.classList.toggle('filter-dropdown-partial', checkedCount > 0 && checkedCount < checkboxes.length);
      dropdown.classList.toggle('filter-dropdown-empty', checkedCount === 0);
  }

  /**
   * Show/hide graph nodes based on the checked resource-type checkboxes.
   * Nodes whose kind isn't covered by RESOURCE_CATEGORIES stay visible
   * (CloudFormation has far more resource types than the curated mapping).
   */
  function updateCategoryFilters() {
      const cy = IV.state.getCy();
      if (!cy) return;
      const { KNOWN_KINDS } = IV.resourceData;

      const visibleKinds = new Set();
      document.querySelectorAll('#categoryFilters .kind-checkbox').forEach(cb => {
          if (cb.checked) visibleKinds.add(cb.value); // value = "AWS::Service::Type"
      });

      cy.batch(() => {
          cy.nodes().forEach(node => {
              if (node.data('group') === 'cluster') return;
              const kind = node.data('kind') || '';

              if (KNOWN_KINDS.has(kind)) {
                  node.style('display', visibleKinds.has(kind) ? 'element' : 'none');
              } else {
                  node.style('display', 'element');
              }
          });
      });
  }

  /**
   * Build the toolbar dropdown filters (one per AWS domain, with a
   * checkbox per service/resource-type) into #categoryFilters.
   */
  function renderFilters() {
      const { RESOURCE_CATEGORIES, DOMAIN_COLORS } = IV.resourceData;
      const container = document.getElementById('categoryFilters');
      if (!container) return;
      container.innerHTML = '';

      for (const [domain, services] of Object.entries(RESOURCE_CATEGORIES)) {
          const dropdown = document.createElement('div');
          dropdown.className = 'filter-dropdown';

          const toggleBtn = document.createElement('button');
          toggleBtn.type = 'button';
          toggleBtn.className = 'filter-dropdown-toggle';
          toggleBtn.style.backgroundColor = DOMAIN_COLORS[domain] || '';
          toggleBtn.textContent = domain.charAt(0).toUpperCase() + domain.slice(1) + ' ▾';
          toggleBtn.addEventListener('click', (e) => {
              e.stopPropagation();
              const wasOpen = dropdown.classList.contains('open');
              closeAllFilterPanels();
              dropdown.classList.toggle('open', !wasOpen);
          });

          const panel = document.createElement('div');
          panel.className = 'filter-dropdown-panel';
          panel.addEventListener('click', (e) => e.stopPropagation());

          const domainLabel = document.createElement('label');
          domainLabel.className = 'filter-category-label';

          const domainCheck = document.createElement('input');
          domainCheck.type = 'checkbox';
          domainCheck.checked = true;
          domainCheck.className = 'category-checkbox';

          domainLabel.appendChild(domainCheck);
          domainLabel.appendChild(document.createTextNode(' ' + domain.charAt(0).toUpperCase() + domain.slice(1)));
          panel.appendChild(domainLabel);

          for (const [service, types] of Object.entries(services)) {
              const svcLabel = document.createElement('div');
              svcLabel.className = 'filter-service-label';
              svcLabel.textContent = service;
              panel.appendChild(svcLabel);

              types.forEach(type => {
                  const label = document.createElement('label');
                  label.className = 'filter-kind-label';
                  const cb = document.createElement('input');
                  cb.type = 'checkbox';
                  cb.checked = true;
                  cb.value = `AWS::${service}::${type}`;
                  cb.className = 'kind-checkbox';
                  cb.dataset.domain = domain;

                  label.appendChild(cb);
                  label.appendChild(document.createTextNode(' ' + type));
                  panel.appendChild(label);

                  cb.addEventListener('change', () => {
                      const allChecked = Array.from(panel.querySelectorAll('.kind-checkbox')).every(c => c.checked);
                      domainCheck.checked = allChecked;
                      updateCategoryFilters();
                      updateDropdownToggleState(dropdown, toggleBtn, domain, panel);
                  });
              });
          }

          domainCheck.addEventListener('change', (e) => {
              const isChecked = e.target.checked;
              panel.querySelectorAll('.kind-checkbox').forEach(cb => {
                  cb.checked = isChecked;
              });
              updateCategoryFilters();
              updateDropdownToggleState(dropdown, toggleBtn, domain, panel);
          });

          dropdown.appendChild(toggleBtn);
          dropdown.appendChild(panel);
          container.appendChild(dropdown);
      }

      document.addEventListener('click', () => closeAllFilterPanels());
  }

  window.IV = window.IV || {};
  window.IV.filters = { renderFilters, updateCategoryFilters };
})();
