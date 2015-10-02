from django.db import models

class Project(models.Model):
    title = models.CharField(max_length=120)
    description = models.TextField()
    creation_date = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title