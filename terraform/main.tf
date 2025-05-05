provider "aws" {
  region = "us-east-1"
}

resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = {
    Name = "main_vpc"
  }
}

resource "aws_subnet" "main" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.1.0/24"
  availability_zone = "us-east-1a"

  tags = {
    Name = "main_subnet"
  }
}

resource "aws_security_group" "allow_ssh" {
  name        = "allow_ssh"
  description = "Allow SSH access"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_key_pair" "quiz_key" {
  key_name   = "quiz"
  public_key = var.ssh_public_key
}

resource "aws_instance" "quiz_instance" {
  ami                    = "ami-0c55b159cbfafe1f0"  # Amazon Linux 2 AMI in us-east-1
  instance_type          = "t2.micro"
  subnet_id              = aws_subnet.main.id
  security_group_ids     = [aws_security_group.allow_ssh.id]
  key_name               = aws_key_pair.quiz_key.key_name
  associate_public_ip_address = true

  tags = {
    Name = "Quiz-Whiz-Instance"
  }
}

output "instance_public_ip" {
  value = aws_instance.quiz_instance.public_ip
}
