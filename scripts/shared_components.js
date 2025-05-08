class SharedFooter extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
                <footer>
                    <div class="footer_container">
                        <p>Copyright &copy; <span id="copyright_year"></span> <b>Adrien Dejonc</b>. All Rights Reserved.</b></p>
                    </div>
                </footer>
        `;
    }
}
customElements.define("shared-footer", SharedFooter);