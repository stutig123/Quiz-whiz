provider "aws" {
  region = "ap-south-1"
}

# -------------------- VPC --------------------
resource "aws_vpc" "simple_vpc" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_support   = true
  enable_dns_hostnames = true
  tags = {
    Name = "SimpleVPC"
  }
}

# -------------------- Subnet --------------------
resource "aws_subnet" "simple_subnet" {
  vpc_id                  = aws_vpc.simple_vpc.id
  cidr_block              = "10.0.1.0/24"
  availability_zone       = "ap-south-1a"
  map_public_ip_on_launch = true
  tags = {
    Name = "SimpleSubnet"
  }
}

# -------------------- Security Group --------------------
resource "aws_security_group" "simple_sg" {
  vpc_id      = aws_vpc.simple_vpc.id
  name        = "simple_sg"
  description = "Allow SSH access"

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

  tags = {
    Name = "SimpleSG"
  }
}

# -------------------- Key Pair --------------------
resource "aws_key_pair" "simple_key" {
  key_name   = "simple-key"
  public_key = file("${path.module}/simple-key.pub") # Replace with your actual public key path
}

# -------------------- EC2 Instance --------------------
resource "aws_instance" "simple_ec2" {
  ami                    = "ami-0f58b397bc5c1f2e8"  # Ubuntu 22.04 LTS in ap-south-1
  instance_type          = "t2.micro"
  key_name               = aws_key_pair.simple_key.key_name
  associate_public_ip_address = true
  subnet_id              = aws_subnet.simple_subnet.id
  vpc_security_group_ids = [aws_security_group.simple_sg.id]

  tags = {
    Name = "SimpleEC2Instance"
  }
}

# -------------------- Outputs --------------------
output "instance_public_ip" {
  value       = aws_instance.simple_ec2.public_ip
  description = "Public IP of the EC2 instance"
}

output "instance_id" {
  value       = aws_instance.simple_ec2.id
  description = "Instance ID of the EC2 instance"
}
