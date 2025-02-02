import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import FormComponent from '../App.vue'

describe('FormComponent', () => {
  it('renders the form with initial state', () => {
    const wrapper = mount(FormComponent)
    expect(wrapper.find('#username').element.value).toBe('')
    expect(wrapper.find('#email').element.value).toBe('')
    expect(wrapper.find('#age').element.value).toBe('')
  })

  it('validates the username field on blur', async () => {
    const wrapper = mount(FormComponent)
    const usernameInput = wrapper.find('#username')
    await usernameInput.setValue('us')
    await usernameInput.trigger('blur')
    expect(wrapper.find('p').text()).toBe('Username must be at least 3 characters')

    await usernameInput.setValue('username')
    await usernameInput.trigger('blur')
    expect(wrapper.find('p').exists()).toBe(false)
  })

  it('validates the email field on blur', async () => {
    const wrapper = mount(FormComponent)
    const emailInput = wrapper.find('#email')
    await emailInput.setValue('invalid-email')
    await emailInput.trigger('blur')
    expect(wrapper.find('p').text()).toBe('Invalid email address')

    await emailInput.setValue('valid@email.com')
    await emailInput.trigger('blur')
    expect(wrapper.find('p').exists()).toBe(false)
  })

  it('validates the age field on blur', async () => {
    const wrapper = mount(FormComponent)
    const ageInput = wrapper.find('#age')
    await ageInput.setValue('17')
    await ageInput.trigger('blur')
    expect(wrapper.find('p').text()).toBe('You must be at least 18 years old')

    await ageInput.setValue('18')
    await ageInput.trigger('blur')
    expect(wrapper.find('p').exists()).toBe(false)
  })

  it('validates the form on submit', async () => {
    const wrapper = mount(FormComponent)
    const form = wrapper.find('form')
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {
      //
    })

    await form.trigger('submit')
    expect(alertMock).not.toHaveBeenCalled()

    const usernameInput = wrapper.find('#username')
    const emailInput = wrapper.find('#email')
    const ageInput = wrapper.find('#age')

    await usernameInput.setValue('username')
    await emailInput.setValue('valid@email.com')
    await ageInput.setValue('18')

    await form.trigger('submit')
    expect(alertMock).toHaveBeenCalledWith('Form submitted successfully!')

    alertMock.mockRestore()
  })
})
