# Vagrantfile API/syntax version. Don't touch unless you know what you're doing!
VAGRANTFILE_API_VERSION = "2"

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|

  config.vm.box = "phusion-open-ubuntu-14.04-amd64"
  config.vm.box_url = "https://oss-binaries.phusionpassenger.com/vagrant/boxes/latest/ubuntu-14.04-amd64-vbox.box"

  config.vm.provider :virtualbox do |v|
        v.name = "Closet Skeleton Dev"
  end

  config.vm.network :private_network, ip: "192.168.33.103"

  # Install Docker
  pkg_cmd = "wget -q -O - https://get.docker.io/gpg | apt-key add -;" \
    "echo deb http://get.docker.io/ubuntu docker main > /etc/apt/sources.list.d/docker.list;" \
    "apt-get update -qq; apt-get install -q -y --force-yes lxc-docker; "
  # Add vagrant user to the docker group
  pkg_cmd << "usermod -a -G docker vagrant; "
  config.vm.provision :shell, privileged: true, :inline => pkg_cmd

  config.vm.provision :shell, privileged: true, run: "always",  path: "scripts/docker-setup.sh"

  start_cmd = "docker start $(docker ps -a -q)"
  config.vm.provision :shell, run: "always", :inline => start_cmd

end
