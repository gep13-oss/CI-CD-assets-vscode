﻿$ErrorActionPreference = 'Stop'

$toolsDir = "$(Split-Path -parent $MyInvocation.MyCommand.Definition)"
. "$toolsDir\Uninstall-VsCodeExtension.ps1"

$packageArgs = @{
  packageName   = $env:ChocolateyPackageName
  extensionName = 'gep13.ci-cd-assets-vscode'
}

Uninstall-VsCodeExtension @packageArgs
