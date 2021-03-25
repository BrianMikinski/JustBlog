

$webDir = "C:\Users\Brian.Mikinski\source\repos\JustBlog\JustBlog.UI" #"-- enter the directory with your webpack.config.js file here";

Write-Host "Creating cert directly into CurrentUser\My store (due to limitation that certs cannot be created directly in root store)"
$cert = New-SelfSignedCertificate -CertStoreLocation Cert:\CurrentUser\My -DnsName localhost -NotAfter ([DateTime]::Now.AddYears(10))

$certFile = Join-Path $webdir "localhost.pfx"
Write-Host "Exporting certificate to $certFile -- this is used by the webpack-dev-server directly with a hardcoded password"
$password = ConvertTo-SecureString -String "abc123" -Force -AsPlainText
Export-PfxCertificate -Cert $cert -FilePath $certFile -Password $password

Write-Host "Importing $certFile to CurrentUser\Root store for immediate system wide trust"
Write-Host "---------- THERE MAY BE A WINDOWS PROMPT WHICH MUST BE ACCEPTED FOR THIS NOW ------------" -ForegroundColor Yellow
Import-PfxCertificate -FilePath $certFile -CertStoreLocation Cert:\LocalMachine\Root -Password $password