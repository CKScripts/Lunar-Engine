function LoadScript(File) {
    return new Promise((Resolve,Reject) => {
        let Script = document.createElement("script")
        Script.src = File
        Script.type = "text/javascript"
        Script.defer = true
        Script.onload = () => Resolve(File+" loaded")
        Script.onerror = () => Reject(new Error(File+" failed to load"))
        document.getElementsByTagName("head").item(0).appendChild(Script)
    })
}

async function ImportScripts() {
    await LoadScript("https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js")
    await LoadScript("../Assets/Scripts/Navbar.js")
    await LoadScript("../Assets/Particles/Particles.min.js")
    await LoadScript("../Assets/Particles/Particles.js")
}

ImportScripts()