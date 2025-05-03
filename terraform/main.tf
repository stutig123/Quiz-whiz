# Provider Configuration
provider "aws" {
  region = "us-east-1"  # Change to your preferred AWS region
}

# Variables Configuration
variable "instance_type" {
  description = "Type of EC2 instance"
  type        = string
  default     = "t2.micro"  # Default EC2 instance type
}

variable "ami_id" {
  description = "AMI ID for the EC2 instance"
  type        = string
  default     = "ami-0c55b159cbfafe1f0"  # Replace with the appropriate AMI for your region
}

variable "key_name" {
  description = "Key name for the EC2 instance"
  type        = string
  default     = "your-ssh-key-name"  # Replace with your SSH key name
}

variable "region" {
  description = "AWS region to deploy resources"
  type        = string
  default     = "us-east-1"  # Default AWS region
}

# EC2 Instance Resource
resource "aws_instance" "quiz_instance" {
  ami           = var.ami_id  # Using variable for AMI
  instance_type = var.instance_type  # Using variable for instance type
  key_name      = var.key_name  # Using variable for key name

  tags = {
    Name = "Quiz-Whiz-Kid"
  }

  # Optionally, you can add security groups, user_data, etc.
}

# Output Values for easy access after Terraform apply
output "instance_public_ip" {
  description = "Public IP of the EC2 instance"
  value       = aws_instance.quiz_instance.public_ip
}

output "instance_id" {
  description = "ID of the EC2 instance"
  value       = aws_instance.quiz_instance.id
}

output "instance_state" {
  description = "State of the EC2 instance"
  value       = aws_instance.quiz_instance.state
}

# Optional: Add security group resource if needed
resource "aws_security_group" "quiz_security_group" {
  name        = "quiz_whiz_kid_sg"
  description = "Allow SSH and HTTP traffic"
  
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]  # Allow SSH from anywhere (or restrict to a specific IP)
  }

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]  # Allow HTTP from anywhere
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]  # Allow all outbound traffic
  }
}

# Attach the security group to the EC2 instance
resource "aws_instance" "quiz_instance_with_sg" {
  ami           = var.ami_id
  instance_type = var.instance_type
  key_name      = var.key_name

  security_groups = [aws_security_group.quiz_security_group.name]

  tags = {
    Name = "Quiz-Whiz-Kid-With-Security"
  }
}

# Optionally, add Elastic IP
resource "aws_eip" "quiz_instance_eip" {
  instance = aws_instance.quiz_instance.id
}

output "elastic_ip" {
  description = "Elastic IP for the EC2 instance"
  value       = aws_eip.quiz_instance_eip.public_ip
}
