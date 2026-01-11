# سكريبت لإزالة جميع dark: classes من الملفات
# سيتم تشغيله في PowerShell

$files = Get-ChildItem -Path . -Include *.jsx,*.tsx,*.ts,*.js -Recurse -Exclude node_modules

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    
    # إزالة جميع dark: classes
    $newContent = $content -replace '\s+dark:[^\s"'']+', ''
    
    if ($content -ne $newContent) {
        Set-Content -Path $file.FullName -Value $newContent -NoNewline
        Write-Host "Updated: $($file.FullName)"
    }
}

Write-Host "Done! All dark: classes removed."
