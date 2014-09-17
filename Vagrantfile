# -*- mode: ruby -*-
# vi: set ft=ruby :

# Vagrantfile API/syntax version. Don't touch unless you know what you're doing!
VAGRANTFILE_API_VERSION = "2"

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
  config.vm.box = "hashicorp/precise32"
  config.vm.network "forwarded_port", guest: 8000, host: 8000
  config.vm.provision :shell do |shell|
    shell.inline = <<-EOS
      apt-get -qy update
      apt-get install python-software-properties software-properties-common -y
      add-apt-repository ppa:chris-lea/node.js
      apt-get update
      apt-get install nodejs -y
      apt-get install git-core vim subversion -y
    EOS
  end
end
