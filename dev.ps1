$env:Path = [System.Environment]::GetEnvironmentVariable('Path','Machine') + ';' + [System.Environment]::GetEnvironmentVariable('Path','User')
Set-Location 'C:\Users\Lenovo\Documents\Default Project\portfolio'
npm run dev -- --port 5173
