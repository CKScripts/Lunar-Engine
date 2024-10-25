// Functions \\
async function GetUserData() {
    try {
        const Response = await fetch("/Api/User/Current", {
            method: "GET",
            headers: {"Content-Type":"application/json"},
            credentials: "include"
        })
        if (!Response.ok) {return null}
        const UserData = await Response.json()
        return UserData
    } catch (Error) {
        console.error("Error: ",Error)
        return null
    }
}

async function AddNavbar() {
    const OffCanvas = document.querySelector(".offcanvas-body")
    if (!OffCanvas) {return}
    const UserData = await GetUserData()
    
    const Navbar = !UserData ? `
        <h6 class="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
            <span class="nav-header"><span class="fa fa-cog me-3"></span>Settings</span>
        </h6>
        <hr class="border-secondary my-3">
        <ul class="nav flex-column mb-2">
            <li class="nav-item"><a class="nav-link text-white d-flex align-items-center login-button" href="/Login"><span class="fa fa-user me-3"></span>Log in</a></li>
        </ul>
    ` : UserData.Role === "Admin" ? `
        <ul class="nav flex-column">
            <h6 class="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
                <span class="nav-header"><span class="fa fa-layer-group me-3"></span>Navigation</span>
            </h6>
            <hr class="border-secondary my-3">
            <ul class="nav flex-column mb-2">
                <li class="nav-item"><a class="nav-link text-white d-flex align-items-center" href="/"><span class="fa fa-home me-3"></span>Home</a></li>
                <li class="nav-item"><a class="nav-link text-white d-flex align-items-center" href="/Games"><span class="fa fa-gamepad me-3"></span>Arcade</a></li>
            </ul>
            <h6 class="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
                <span class="nav-header"><span class="fa fa-user-shield me-3"></span>Administration</span>
            </h6>
            <hr class="border-secondary my-3">
            <ul class="nav flex-column mb-2">
                <li class="nav-item"><a class="nav-link text-white d-flex align-items-center" href="#"><span class="fas fa-tachometer-alt me-3"></span>Dashboard</a></li>
                <li class="nav-item"><a class="nav-link text-white d-flex align-items-center" href="#"><span class="fas fa-chart-line me-3"></span>Analytics</a></li>
                <li class="nav-item"><a class="nav-link text-white d-flex align-items-center" href="#"><span class="fas fa-search me-3"></span>User Lookup</a></li>
                <li class="nav-item"><a class="nav-link text-white d-flex align-items-center" href="#"><span class="fas fa-users-cog me-3"></span>User Management</a></li>
                <li class="nav-item"><a class="nav-link text-white d-flex align-items-center" href="#"><span class="fas fa-file-alt me-3"></span>Reports</a></li>
                <li class="nav-item"><a class="nav-link text-white d-flex align-items-center" href="#"><span class="fas fa-clipboard-list me-3"></span>Audit Logs</a></li>
                <li class="nav-item"><a class="nav-link text-white d-flex align-items-center" href="#"><span class="fas fa-sliders-h me-3"></span>System Settings</a></li>
                <li class="nav-item"><a class="nav-link text-white d-flex align-items-center" href="#"><span class="fas fa-life-ring me-3"></span>Support/Tickets</a></li>
                <li class="nav-item"><a class="nav-link text-white d-flex align-items-center" href="#"><span class="fas fa-stream me-3"></span>Activity Log</a></li>
            </ul>
            <h6 class="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
                <span class="nav-header"><span class="fa fa-cog me-3"></span>Settings</span>
            </h6>
            <hr class="border-secondary my-3">
            <ul class="nav flex-column mb-2">
                <li class="nav-item"><a class="nav-link text-white d-flex align-items-center" href="#"><span class="fas fa-user-circle me-3"></span>Profile</a></li>
                <li class="nav-item"><a class="nav-link text-white d-flex align-items-center" href="#"><span class="fas fa-bell me-3"></span>Notifications</a></li>
                <li class="nav-item"><a class="nav-link text-white d-flex align-items-center" class="LogoutButton" href="#"><span class="fas fa-sign-out-alt me-3"></span>Log out</a></li>
            </ul>
        </ul>
    ` : UserData.Role === "User" ? `
        <h6 class="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
            <span class="nav-header"><span class="fa fa-layer-group me-3"></span>Navigation</span>
        </h6>
        <hr class="border-secondary my-3">
        <ul class="nav flex-column mb-2">
            <li class="nav-item"><a class="nav-link text-white d-flex align-items-center" href="/"><span class="fa fa-home me-3"></span>Home</a></li>
            <li class="nav-item"><a class="nav-link text-white d-flex align-items-center" href="/Games"><span class="fa fa-gamepad me-3"></span>Arcade</a></li>
        </ul>
        <h6 class="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
            <span class="nav-header"><span class="fa fa-cog me-3"></span>Settings</span>
        </h6>
        <hr class="border-secondary my-3">
        <ul class="nav flex-column mb-2">
            <li class="nav-item"><a class="nav-link text-white d-flex align-items-center" href="#"><span class="fas fa-user-circle me-3"></span>Profile</a></li>
            <li class="nav-item"><a class="nav-link text-white d-flex align-items-center" href="#"><span class="fas fa-bell me-3"></span>Notifications</a></li>
            <li class="nav-item"><a class="nav-link text-white d-flex align-items-center" class="LogoutButton" href="#"><span class="fas fa-sign-out-alt me-3"></span>Log out</a></li>
        </ul>
    ` : `
        <h6 class="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
            <span class="nav-header"><span class="fa fa-cog me-3"></span>Settings</span>
        </h6>
        <hr class="border-secondary my-3">
        <ul class="nav flex-column mb-2">
            <li class="nav-item"><a class="nav-link text-white d-flex align-items-center login-button" href="/Login"><span class="fa fa-user me-3"></span>Log in</a></li>
        </ul>
    `
    OffCanvas.insertAdjacentHTML("afterbegin", Navbar)
}

AddNavbar()