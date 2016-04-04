<?php

namespace VisualComposer\Helpers\Generic\Access;

use VisualComposer\Helpers\WordPress\Nonce;

/**
 * Class Access
 * @package VisualComposer\Helpers\Generic\Access
 */
trait Access
{
    /**
     * @var bool
     */
    protected $validAccess = true;

    /**
     * @return bool
     */
    public function getValidAccess()
    {
        return $this->validAccess;
    }

    /**
     * @param mixed $validAccess
     *
     * @return self
     */
    public function setValidAccess($validAccess)
    {
        $this->validAccess = $validAccess;

        return $this;
    }

    /**
     * Check multi access settings by method inside class object
     *
     * @param $callback callable
     * @param $valid
     * @param $argsList
     *
     * @return self
     */
    public function checkMulti($callback, $valid, $argsList)
    {
        if ($this->getValidAccess()) {
            $access = !$valid;
            foreach ($argsList as $args) {
                if (!is_array($args)) {
                    $args = [$args];
                }
                $this->setValidAccess(true);
                vcapp()->call($callback, $args);
                if ($valid === $this->getValidAccess()) {
                    $access = $valid;
                    break;
                }
            }
            $this->setValidAccess($access);
        }

        return $this;
    }

    /**
     * Get current validation state and reset it to true. ( should be never called twice )
     *
     * @param bool $reset
     *
     * @return bool
     */
    public function get($reset = true)
    {
        $result = $this->getValidAccess();
        if ($reset) {
            $this->reset();
        }

        return $result;
    }

    /**
     * @return $this
     */
    public function reset()
    {
        $this->setValidAccess(true);

        return $this;
    }

    /**
     * Call die() function with message if access is invalid
     *
     * @param string $message
     *
     * @return self
     * @throws \Exception
     */
    public function validateDie($message = '')
    {
        $result = $this->getValidAccess();
        $this->setValidAccess(true);
        if (!$result) {
            if (defined('VCV_DIE_EXCEPTION') && VCV_DIE_EXCEPTION) {
                throw new \Exception($message);
            } else {
                die($message);
            }
        }

        return $this;
    }

    /**
     * @param $func
     *
     * @return self
     */
    public function check($func)
    {
        if ($this->getValidAccess()) {
            $args = func_get_args();
            $args = array_slice($args, 1);
            $this->setValidAccess(vcapp()->call($func, $args));
        }

        return $this;
    }

    /**
     * Any of provided rules should be valid
     *
     * @return self
     */
    public function checkAny()
    {
        if ($this->getValidAccess()) {
            $args = func_get_args();
            $this->checkMulti([$this, 'check'], true, $args);
        }

        return $this;
    }

    /**
     * All provided rules should be valid
     *
     * @return self
     */
    public function checkAll()
    {
        if ($this->getValidAccess()) {
            $args = func_get_args();
            $this->checkMulti([$this, 'check'], false, $args);
        }

        return $this;
    }

    /**
     * @param string $nonce
     *
     * @return $this
     */
    public function checkAdminNonce($nonce = '')
    {
        /** @var Nonce $nonceHelper */
        $nonceHelper = vchelper('nonce');

        /** @see \VisualComposer\Helpers\WordPress\Nonce::verifyAdmin */
        return $this->check([$nonceHelper, 'verifyAdmin'], $nonce);
    }

    /**
     * @param string $nonce
     *
     * @return $this
     */
    public function checkPublicNonce($nonce = '')
    {
        /** @var Nonce $nonceHelper */
        $nonceHelper = vchelper('nonce');

        /** @see \VisualComposer\Helpers\WordPress\Nonce::verifyUser */
        return $this->check([$nonceHelper, 'verifyUser'], $nonce);
    }
}
