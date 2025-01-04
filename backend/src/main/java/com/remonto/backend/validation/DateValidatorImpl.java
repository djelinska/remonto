package com.remonto.backend.validation;

import com.remonto.backend.model.Task;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class DateValidatorImpl implements ConstraintValidator<DateValidator, Task> {
    @Override
    public boolean isValid(Task task, ConstraintValidatorContext context) {
        if (task.getStartTime() == null || task.getEndTime() == null) {
            return true;
        }
        return !task.getEndTime().isBefore(task.getStartTime());
    }
}